# Use a slim Python base image
FROM python:3.9-slim

# Slow or flaky connections: wait longer and retry more before a download fails.
ENV PIP_DEFAULT_TIMEOUT=1000 PIP_RETRIES=10

WORKDIR /app

# Install git, wget, unzip, build-essential, and other common dependencies
# libSM6, libXext6, libXrender-dev are common for OpenCV headless
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git wget unzip build-essential python3-pip \
    libsm6 libxext6 libxrender-dev \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install PyTorch for CPU first (torch 1.11.0, torchvision 0.12.0 as per model's origin)
RUN pip install --no-cache-dir torch==1.11.0 torchvision==0.12.0 -f https://download.pytorch.org/whl/cpu/torch_stable.html

# Install mmcv-full for CPU, compatible with PyTorch 1.11.0
# Version 1.5.3 is used for consistency with original Dockerfile's mmcv version.
RUN pip install --no-cache-dir mmcv-full==1.5.3 -f https://download.openmmlab.com/mmcv/dist/cpu/torch1.11.0/index.html

# Install other Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Clone the TruFor repository into a specific directory
RUN git clone https://github.com/grip-unina/TruFor.git trufor_model_code

# Download TruFor weights
# Create a directory for weights
RUN mkdir -p /app/weights
# Download and extract weights
RUN wget -q https://www.grip.unina.it/download/prog/TruFor/TruFor_weights.zip -O /app/TruFor_weights.zip && \
    mkdir /app/temp_weights && \
    unzip -q /app/TruFor_weights.zip -d /app/temp_weights && \
    # The zip extracts to temp_weights/weights/trufor.pth.tar based on typical structure or directly
    if [ -f /app/temp_weights/weights/trufor.pth.tar ]; then \
        mv /app/temp_weights/weights/trufor.pth.tar /app/weights/trufor.pth.tar; \
    elif [ -f /app/temp_weights/trufor.pth.tar ]; then \
        mv /app/temp_weights/trufor.pth.tar /app/weights/trufor.pth.tar; \
    else \
        echo "Error: trufor.pth.tar not found in expected zip structure." && exit 1; \
    fi && \
    rm /app/TruFor_weights.zip && \
    rm -rf /app/temp_weights

# Verify weights downloaded
RUN if [ ! -f /app/weights/trufor.pth.tar ]; then echo "Weight file not found!" && exit 1; else echo "Weight file found."; fi

# Copy the application file
COPY app.py .

# Set Python path to include the cloned repository's src directory and /app
# This allows app.py to import modules from the cloned model_code directory
ENV PYTHONPATH=/app:/app/trufor_model_code/test_docker/src

# Environment variables for the application
ENV MODEL_PORT=5005
ENV USE_GPU=false  
ENV PRELOAD_MODEL=false
ENV MODEL_TIMEOUT=600

# Expose the application port
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