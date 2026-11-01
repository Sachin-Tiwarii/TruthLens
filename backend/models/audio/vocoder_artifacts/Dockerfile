FROM python:3.9-slim

# Slow or flaky connections: wait longer and retry more before a download fails.
ENV PIP_DEFAULT_TIMEOUT=1000 PIP_RETRIES=10 PYTHONUNBUFFERED=1

# ffmpeg decodes every upload format (wav, mp3, m4a, flac, ogg) to 24 kHz mono.
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# CPU-only PyTorch (PyPI's default build pulls in GBs of CUDA libraries).
RUN pip install --no-cache-dir torch==1.13.1 \
    --index-url https://download.pytorch.org/whl/cpu --extra-index-url https://pypi.org/simple

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Original model code (MIT), pinned to the commit this service was written against.
RUN git clone https://github.com/csun22/Synthetic-Voice-Detection-Vocoder-Artifacts.git temp_repo && \
    git -C temp_repo checkout 74b85277fe95583b23a2766bf45d15463c772ee5

# Pretrained weights (Google Drive, linked from the original README). If the automatic
# download fails, download the file manually, save it as
# models/audio/vocoder_artifacts/weights/vocoder_artifacts.pth and rebuild.
COPY weights/ /app/weights/
RUN if [ ! -s /app/weights/vocoder_artifacts.pth ]; then \
        gdown --fuzzy "https://drive.google.com/file/d/15qOi26czvZddIbKP_SOR8SLQFZK8cf8E/view" \
              -O /app/weights/vocoder_artifacts.pth || true; \
    fi && \
    python -c "import torch,sys; sd=torch.load('/app/weights/vocoder_artifacts.pth', map_location='cpu'); print('weights OK:', len(sd), 'tensors')" || \
    (echo "ERROR: could not get valid model weights. Download https://drive.google.com/file/d/15qOi26czvZddIbKP_SOR8SLQFZK8cf8E/view and save it as models/audio/vocoder_artifacts/weights/vocoder_artifacts.pth, then rebuild." && exit 1)

COPY api.py .

ENV MODEL_PORT=8001 PRELOAD_MODEL=false MODEL_TIMEOUT=600

EXPOSE 8001

CMD ["python", "api.py"]
