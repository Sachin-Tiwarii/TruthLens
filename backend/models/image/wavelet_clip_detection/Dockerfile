# Use a specific Python version
FROM python:3.9-slim

# Slow or flaky connections: wait longer and retry more before a download fails.
ENV PIP_DEFAULT_TIMEOUT=1000 PIP_RETRIES=10

# Set working directory
WORKDIR /app

# Install git and other dependencies
RUN apt-get update && \
    apt-get install -y git wget build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install pip first
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install numpy with compatible version for scipy
RUN pip install --no-cache-dir numpy==1.22.0

# Install PyTorch
RUN pip install torch==1.12.0 torchvision==0.13.0 --extra-index-url https://download.pytorch.org/whl/cpu

# Install other dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Clone the Wavelet-CLIP repository
RUN git clone https://github.com/lalithbharadwajbaru/Wavelet-CLIP.git model_code

# Create directory for model weights
RUN mkdir -p model_code/weights

# Download model weights from Google Drive and handle subfolder
RUN gdown --folder https://drive.google.com/drive/folders/1Z7pH9KPQbx1TrMqap2y9Op6OUO9SHP_D -O model_code/weights/ && \
    ls -la model_code/weights/ && \
    # Move the files from the subfolder to the main weights directory
    mv model_code/weights/wavelet_clip_detection/* model_code/weights/ && \
    # Verify the files were moved
    ls -la model_code/weights/

# Create __init__.py files to make directories proper Python packages
RUN touch model_code/__init__.py && \
    touch model_code/training/__init__.py && \
    touch model_code/training/detectors/__init__.py && \
    touch model_code/training/metrics/__init__.py && \
    touch model_code/training/loss/__init__.py

# Copy the application file
COPY app.py .

# Environment Variables
ENV MODEL_PORT=5003
ENV MODEL_PATH=model_code/weights/clip_wavelet_best.pth
ENV PRELOAD_MODEL="false"
ENV MODEL_TIMEOUT="600"
ENV PYTHONPATH=/app/model_code:/app/model_code/training:$PYTHONPATH

# Expose port
EXPOSE ${MODEL_PORT}

# Command to run the application

# Old PyTorch wheels (1.11/1.12) mark libtorch as needing an executable stack, which newer
# Linux kernels/glibc refuse ("cannot enable executable stack"). Clear that ELF flag.
RUN python - <<'EOF'
import glob, struct, sysconfig
site = sysconfig.get_paths()["purelib"]
for path in glob.glob(f"{site}/torch*/**/*.so*", recursive=True):
    with open(path, "r+b") as f:
        hdr = f.read(64)
        if hdr[:4] != b"\x7fELF" or hdr[4] != 2:
            continue
        phoff = struct.unpack_from("<Q", hdr, 0x20)[0]
        phentsize, phnum = struct.unpack_from("<HH", hdr, 0x36)
        for i in range(phnum):
            off = phoff + i * phentsize
            f.seek(off)
            p_type, p_flags = struct.unpack("<II", f.read(8))
            if p_type == 0x6474E551 and p_flags & 1:  # PT_GNU_STACK with PF_X
                f.seek(off + 4)
                f.write(struct.pack("<I", p_flags & ~1))
                print("cleared executable-stack flag:", path)
EOF
RUN python -c "import torch; print('torch', torch.__version__, 'imports OK')"

CMD ["python", "app.py"]