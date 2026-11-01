#!/bin/bash
# Manual fallback for the Vocoder Artifacts weights (~100 MB).
# Only needed if the automatic download in the Dockerfile fails. Run from this folder,
# then rebuild:  docker compose build vocoder_artifacts
set -e

OUT="weights/vocoder_artifacts.pth"
FILE_URL="https://drive.google.com/file/d/15qOi26czvZddIbKP_SOR8SLQFZK8cf8E/view"

mkdir -p weights
command -v gdown >/dev/null 2>&1 || pip install gdown

gdown --fuzzy "$FILE_URL" -O "$OUT"

if [ -s "$OUT" ]; then
    echo "Weights saved to $(pwd)/$OUT"
else
    echo "Download failed. Download it in a browser from:"
    echo "  $FILE_URL"
    echo "and save it as $(pwd)/$OUT"
    exit 1
fi
