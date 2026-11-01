"""
Vocoder Artifacts audio deepfake detector service for TruthLens.

Model: RawNet2 variant from "AI-Synthesized Voice Detection Using Neural Vocoder Artifacts"
(Sun et al., CVPR 2023 Workshops), https://github.com/csun22/Synthetic-Voice-Detection-Vocoder-Artifacts
(MIT licence). Preprocessing mirrors the original eval.py:
  - audio resampled to 24 kHz mono
  - split into 4 s segments of 96,000 samples; clips shorter than that are padded by repetition
  - binary probabilities averaged over segments; output index 0 = fake, index 1 = real
The model also scores which of 6 vocoders (or ground truth) produced the audio.

Same HTTP contract as the other TruthLens model services:
  POST /predict  {"audio_data": "<base64 file bytes>", "threshold": 0.5}
  GET  /health,  POST /unload
"""

import base64
import gc
import logging
import os
import subprocess
import sys
import tempfile
import threading
import time

import numpy as np
import torch
import torch.nn.functional as F
import yaml
from flask import Flask, jsonify, request

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("vocoder_artifacts")

MODEL_NAME = "vocoder_artifacts"
REPO_DIR = os.environ.get("VOCODER_REPO_DIR", "/app/temp_repo")
WEIGHTS_PATH = os.environ.get("WEIGHTS_PATH", "/app/weights/vocoder_artifacts.pth")
SAMPLE_RATE = 24000
SEGMENT_SAMPLES = 96000  # 4 s at 24 kHz, as in the original training/eval code
MIN_SECONDS = 0.5
MAX_DECODE_SECONDS = int(os.environ.get("MAX_DECODE_SECONDS", "120"))
MAX_SEGMENTS = int(os.environ.get("MAX_SEGMENTS", "15"))  # cap CPU time on long files
MODEL_TIMEOUT = int(os.environ.get("MODEL_TIMEOUT", "600"))
PRELOAD_MODEL = os.environ.get("PRELOAD_MODEL", "false").lower() == "true"
VOCODER_LABELS = ["ground_truth", "wavegrad", "diffwave", "parallel_wave_gan", "wavernn", "wavenet", "melgan"]

sys.path.insert(0, REPO_DIR)
from model import RawNet  # noqa: E402  (from the cloned original repository)

torch.set_num_threads(max(1, (os.cpu_count() or 2) // 2))
DEVICE = "cpu"

app = Flask(__name__)
_model = None
_model_lock = threading.Lock()
_last_used = 0.0


def weights_available() -> bool:
    return os.path.isfile(WEIGHTS_PATH) and os.path.getsize(WEIGHTS_PATH) > 1_000_000


def get_model():
    global _model, _last_used
    with _model_lock:
        if _model is None:
            if not weights_available():
                raise RuntimeError(f"Model weights not found at {WEIGHTS_PATH}.")
            logger.info(f"Loading model '{MODEL_NAME}'...")
            with open(os.path.join(REPO_DIR, "model_config_RawNet.yaml"), "r") as f:
                d_args = yaml.safe_load(f)["model"]
            model = RawNet(d_args, DEVICE)
            state = torch.load(WEIGHTS_PATH, map_location=DEVICE)
            model.load_state_dict(state)
            model.to(DEVICE).eval()
            _model = model
            logger.info(f"Model '{MODEL_NAME}' loaded.")
        _last_used = time.time()
        return _model


def unload_model() -> bool:
    global _model
    with _model_lock:
        if _model is None:
            return False
        _model = None
    gc.collect()
    logger.info(f"Model '{MODEL_NAME}' unloaded.")
    return True


def decode_audio(audio_bytes: bytes) -> np.ndarray:
    """Decode any format ffmpeg understands (wav, mp3, m4a, flac, ogg, ...) to 24 kHz mono float32."""
    # A temp file rather than a pipe: MP4/M4A containers often need seeking to be read.
    with tempfile.NamedTemporaryFile(suffix=".audio", delete=False) as tmp:
        tmp.write(audio_bytes)
        path = tmp.name
    try:
        proc = subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", path,
             "-t", str(MAX_DECODE_SECONDS), "-vn", "-ac", "1", "-ar", str(SAMPLE_RATE),
             "-f", "f32le", "-acodec", "pcm_f32le", "pipe:1"],
            capture_output=True,
            timeout=180,
        )
    finally:
        os.remove(path)
    if proc.returncode != 0 or not proc.stdout:
        detail = proc.stderr.decode(errors="ignore").strip().splitlines()
        raise ValueError(
            "Could not read the audio file" + (f": {detail[-1]}" if detail else ".")
        )
    return np.frombuffer(proc.stdout, dtype=np.float32).copy()


def pad_by_repeat(x: np.ndarray) -> np.ndarray:
    if len(x) >= SEGMENT_SAMPLES:
        return x[:SEGMENT_SAMPLES]
    repeats = SEGMENT_SAMPLES // len(x) + 1
    return np.tile(x, repeats)[:SEGMENT_SAMPLES]


def make_segments(y: np.ndarray) -> list:
    if len(y) <= SEGMENT_SAMPLES:
        return [pad_by_repeat(y)]
    segments = [y[i * SEGMENT_SAMPLES:(i + 1) * SEGMENT_SAMPLES] for i in range(len(y) // SEGMENT_SAMPLES)]
    if len(segments) > MAX_SEGMENTS:
        picks = np.linspace(0, len(segments) - 1, MAX_SEGMENTS).round().astype(int)
        segments = [segments[i] for i in picks]
    return segments


@app.route("/health", methods=["GET"])
def health():
    found = weights_available()
    return jsonify({
        "status": "healthy" if found else "error",
        "model_name": MODEL_NAME,
        "model_loaded": _model is not None,
        "weights_found": found,
        **({} if found else {"message": f"Model weights missing at {WEIGHTS_PATH}"}),
    })


@app.route("/unload", methods=["POST"])
def unload():
    was_loaded = unload_model()
    return jsonify({"status": "unloaded" if was_loaded else "not_loaded", "message": f"{MODEL_NAME} unloaded."})


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    audio_b64 = data.get("audio_data")
    threshold = float(data.get("threshold", 0.5))
    if not audio_b64:
        return jsonify({"error": "Missing audio_data."}), 400

    started = time.time()
    try:
        audio = decode_audio(base64.b64decode(audio_b64))
    except (ValueError, subprocess.TimeoutExpired) as e:
        return jsonify({"error": str(e)}), 400

    duration = len(audio) / SAMPLE_RATE
    if duration < MIN_SECONDS:
        return jsonify({"error": f"Audio is too short ({duration:.2f} s). At least {MIN_SECONDS} s is needed."}), 400
    if float(np.max(np.abs(audio))) < 1e-4:
        return jsonify({"error": "The audio appears to be silent."}), 400

    try:
        model = get_model()
    except Exception as e:
        logger.exception("Model load failed")
        return jsonify({"error": f"Model unavailable: {e}"}), 503

    segments = make_segments(audio)
    batch = torch.from_numpy(np.stack(segments)).float()
    with torch.no_grad():
        logits, multi_logits = model(batch)
        binary = F.softmax(logits, dim=-1).mean(dim=0)
        multi = F.softmax(multi_logits, dim=-1).mean(dim=0)

    prob_fake = float(binary[0])  # index 0 = fake, index 1 = real (original eval.py)
    prediction = 1 if prob_fake >= threshold else 0
    globals()["_last_used"] = time.time()

    return jsonify({
        "model": MODEL_NAME,
        "probability": prob_fake,
        "prediction": prediction,
        "class": "fake" if prediction == 1 else "real",
        "inference_time": time.time() - started,
        "audio_duration_seconds": round(duration, 2),
        "segments_analyzed": len(segments),
        "vocoder_probabilities": {name: round(float(p), 4) for name, p in zip(VOCODER_LABELS, multi)},
    })


def _idle_unloader():
    while True:
        time.sleep(30)
        if _model is not None and time.time() - _last_used > MODEL_TIMEOUT:
            unload_model()


if __name__ == "__main__":
    if not weights_available():
        logger.error(f"Model weights missing at {WEIGHTS_PATH}; /health will report an error.")
    elif PRELOAD_MODEL:
        get_model()
    threading.Thread(target=_idle_unloader, daemon=True).start()
    app.run(host="0.0.0.0", port=int(os.environ.get("MODEL_PORT", "8001")), threaded=True)
