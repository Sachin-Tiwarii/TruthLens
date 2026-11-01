# Vocoder Artifacts — audio deepfake detector

Detects AI-synthesized speech by looking for artifacts left by neural vocoders.

- **Source:** [csun22/Synthetic-Voice-Detection-Vocoder-Artifacts](https://github.com/csun22/Synthetic-Voice-Detection-Vocoder-Artifacts) (MIT licence), pinned to commit `74b8527`
- **Paper:** Sun et al., *AI-Synthesized Voice Detection Using Neural Vocoder Artifacts*, CVPR 2023 Workshops
- **Model:** RawNet2 variant with a binary real/fake head plus a 7-way vocoder head
- **Trained on:** LibriSeVoc (English read speech; WaveGrad, DiffWave, Parallel WaveGAN, WaveRNN, WaveNet, MelGAN)

## How audio is processed

Matches the original `eval.py`:

1. Any format ffmpeg can read (wav, mp3, m4a, flac, ogg) is decoded to 24 kHz mono.
2. The audio is split into 4-second segments (96,000 samples). Clips under 4 s are padded by repeating them.
3. Real/fake probabilities are averaged over the segments. At most 15 segments (~60 s, evenly spread) are used, and at most the first 120 s of a file are decoded.

## Weights

The Docker build downloads them from Google Drive automatically. If that fails (Drive sometimes blocks automated downloads), download the file manually:

https://drive.google.com/file/d/15qOi26czvZddIbKP_SOR8SLQFZK8cf8E/view

Save it as `weights/vocoder_artifacts.pth` in this folder (or run `download_weights.sh`), then rebuild:

```bash
docker compose build vocoder_artifacts
docker compose up -d vocoder_artifacts
```

The `.pth` file is gitignored.

## API (port 8001)

- `GET /health` — `status` is `error` if the weights are missing
- `POST /predict` — body `{"audio_data": "<base64 file>", "threshold": 0.5}`. Returns `probability` (likelihood of fake), `prediction`, `class`, `inference_time`, `audio_duration_seconds`, `segments_analyzed` and `vocoder_probabilities`.
- `POST /unload` — frees the model from memory

## Limitations

Trained on English read speech made by older vocoders. Expect weaker results on other languages, phone or compressed recordings, background noise and modern voice-cloning systems.
