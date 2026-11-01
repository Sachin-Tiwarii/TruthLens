# TruthLens backend

The backend is a set of Docker containers started with Docker Compose:

- **`api`**: a FastAPI gateway on port 8000. It handles accounts, uploads, history and combining model scores into a verdict. It started from the open-source [DeepSafe](https://github.com/siddharthksah/DeepSafe) project.
- **Detector services**: one container per model. Each is a small HTTP service that takes base64 media and returns the probability that it is fake.

![Architecture](../docs/architecture.svg)

## Requirements

- Docker Desktop (on Windows: the WSL 2 backend).
- Docker Desktop's memory limit sets how many models you can run at once.
  - Models load on their first request. A model uses a few hundred MB while idle and up to about 2 GB once loaded (UniversalFakeDetect: ~1.9 GB).
  - On a 16 GB machine Docker gets about 8 GB, which is enough for the default stack plus a few extra models.
- Build one model at a time. Building several in parallel can run Docker out of memory and crash its engine.

## Run it

```bash
cd backend
cp .env.example .env          # then set SECRET_KEY (see the comment in the file)
docker compose up -d --build  # api + NPR + UniversalFakeDetect + Cross Efficient ViT
```

The first build downloads PyTorch and the model weights. It takes a while.

Optional models use the `extra` Compose profile. To start some of them, name them:

```bash
docker compose up -d --build trufor vocoder_artifacts
```

To start all of them, run `docker compose --profile extra up -d --build`. To always include them, add `COMPOSE_PROFILES=extra` to `.env`.

Check that it works:

- Open <http://localhost:8000/health>. It shows each model as `healthy` or `unreachable`.
  - Models you haven't started show as unreachable and mark the API as `degraded`. That is expected: analysis uses whichever models are up.
- Open <http://localhost:8000/docs> for the interactive API docs.

Use `localhost`, not `0.0.0.0`, in the browser.

### Day-to-day commands

| Task | Command |
|---|---|
| Logs | `docker compose logs -f api` |
| Stop everything | `docker compose stop` |
| Rebuild only the API after editing `api/` | `docker compose build api && docker compose up -d --no-deps api` |
| Rebuild one model | `docker compose build <service> && docker compose up -d <service>` |

`docker compose up --build api` also rebuilds every service the API depends on. Use the `build` + `--no-deps` form above instead.

### If Docker returns "500 Internal Server Error"

This error appears on `docker compose` commands, often on `_ping` or `dockerDesktopLinuxEngine`. It means Docker's engine crashed, usually from running out of memory during a build. To recover:

1. Quit Docker Desktop.
2. Run `wsl --shutdown`.
3. Start Docker Desktop again.

The containers restart on their own.

## Detection models

| Service | Media | Port | Starts by default | Upstream code | Notes |
|---|---|---|---|---|---|
| `npr_deepfakedetection` | image | 5001 | yes | [NPR-DeepfakeDetection](https://github.com/chuangchuangtan/NPR-DeepfakeDetection) | Upsampling artifacts left by GAN and diffusion generators |
| `universalfakedetect` | image | 5004 | yes | [UniversalFakeDetect](https://github.com/WisconsinAIVision/UniversalFakeDetect) | CLIP ViT-L/14 features with a linear classifier |
| `trufor` | image | 5005 | no | [TruFor](https://github.com/grip-unina/TruFor) | Image manipulation and forgery detection |
| `yermandy_clip_detection` | image | 5002 | no | [yermandy/deepfake-detection](https://github.com/yermandy/deepfake-detection) | CLIP-based face deepfake detector |
| `wavelet_clip_detection` | image | 5003 | no | [Wavelet-CLIP](https://github.com/lalithbharadwajbaru/Wavelet-CLIP) | The build currently fails: Google Drive blocks the automatic weights-folder download |
| `spsl_deepfake_detection` | image | 5006 | no | [DeepfakeBench](https://github.com/SCLBD/DeepfakeBench) (SPSL) | Face-swap detector. Needs a detectable face |
| `ucf_deepfake_detection` | image | 5007 | no | [DeepfakeBench](https://github.com/SCLBD/DeepfakeBench) (UCF) | Face-swap detector. Needs a detectable face |
| `cross_efficient_vit` | video | 7001 | yes | [Combining EfficientNet and ViT](https://github.com/davide-coccomini/Combining-EfficientNet-and-Vision-Transformers-for-Video-Deepfake-Detection) | Face-based video deepfake detector |
| `vocoder_artifacts` | audio | 8001 | no | [Vocoder Artifacts](https://github.com/csun22/Synthetic-Voice-Detection-Vocoder-Artifacts) | Synthetic speech. See [its README](models/audio/vocoder_artifacts/README.md) |

Most weights download during the Docker build. Some come from the [DeepSafe-weights](https://huggingface.co/siddharthksah/DeepSafe-weights) Hugging Face repo; others come from each project's own release.

Every model was trained on a specific dataset and generator family. Expect weaker results on newer generators and on heavily compressed or re-encoded files. The face-only models give no useful signal on images without a face.

## How a verdict is made

![Request flow](../docs/request-flow.svg)

1. **Media type:** `POST /detect` works out the media type from the content type, falling back to the file extension.
2. **File checks:** it enforces the size limit and records the SHA-256 of the received bytes.
3. **Querying models:** the gateway sends the file to every model listed for that media type in [`config/truthlens_config.json`](config/truthlens_config.json).
   - A model that can't be reached is skipped for 10 minutes so it doesn't slow every request. `/health` clears the skip when the model comes back.
4. **Combining scores:** each model returns P(fake). The gateway combines them with the default method, `stacking`:
   - **stacking:** an XGBoost meta-learner trained on the outputs of the 7 image models (`api/meta_model_artifacts/image`). It is used only when at least 85% of its models answered (`min_stacking_coverage`).
   - **average:** the mean P(fake). This is the fallback when stacking can't be used, and it is always what video and audio get, since they have no meta-learner.
   - **voting:** the share of models that said "fake". Use it by passing `ensemble_method=voting`.
5. **Verdict:** `fake` if the combined P(fake) ≥ `threshold` (default 0.5), otherwise `real`. Confidence is P(fake) for a fake verdict and 1 − P(fake) for a real one.
6. **Failures:** if no model returns a result, the request fails:
   - 503 when no model for that media type is running;
   - 422 when every model rejected the file for the same reason, such as audio that is too short.
7. **Storage:** the result and the full per-model response are saved to SQLite for the user's history.

Not implemented yet:
- an `inconclusive` verdict when models disagree;
- metadata/EXIF or C2PA checks;
- recording model versions;
- caching by hash;
- background jobs (`/detect` is synchronous).

## API

All endpoints except `/`, `/health`, `/predict`, `/token` and `/register` need `Authorization: Bearer <token>`.

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/register` | form: `username` (email), `password` (≥ 4 chars), optional `full_name` | `{access_token, token_type}` |
| POST | `/token` | form: `username`, `password` (OAuth2 password flow) | `{access_token, token_type}` |
| GET | `/users/me` | — | `{username, email, full_name, disabled}` |
| POST | `/detect` | multipart: `file`; optional `threshold`, `ensemble_method` (`stacking`/`average`/`voting`), `models` (comma-separated) | Verdict, `deepfake_probability`, votes, `model_results`, `media_sha256`, `request_id` |
| GET | `/history` | query: `limit` (100), `offset`, `media_type` | `{total, limit, offset, records[]}` for the current user |
| GET | `/history/{request_id}` | — | One stored analysis with `full_response`. 404 if it isn't yours |
| POST | `/predict` | JSON: `media_type`, `image_data`/`video_data`/`audio_data` (base64), `threshold`, `ensemble_method`, `models` | Full per-model result. No auth and not linked to a user |
| GET | `/health` | — | Overall status and each model's health |

Tokens last 24 hours (`ACCESS_TOKEN_EXPIRE_MINUTES`).

Timestamps are UTC ISO-8601 with a `Z` suffix.

Errors use FastAPI's `{"detail": "..."}` shape. Common statuses:

| Status | Meaning |
|---|---|
| 401 | Not logged in, or the token has expired |
| 413 | File too large |
| 415 | Unsupported file type, or no models for that media type |
| 422 | The file was rejected by every model |
| 503 | No model is available |

### Accepted files

| Media | Extensions | Max size |
|---|---|---|
| Image | jpg, jpeg, png, webp, bmp, gif, tiff | 115 MB |
| Video | mp4, avi, mov, mkv, webm | 115 MB |
| Audio | wav, mp3, m4a, flac, ogg | 50 MB |

The frontend's upload box has its own limit of 100 MB.

## Configuration

**`.env`** (read by Docker Compose):

| Variable | Default | Purpose |
|---|---|---|
| `SECRET_KEY` | insecure dev value | Signs JWTs. Set a long random value. |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Browser origins allowed to call the API. Add your deployed frontend URL. |
| `COMPOSE_PROFILES` | — | Set to `extra` to always start the optional models. |

**`config/truthlens_config.json`** (mounted into the API container):

- model URLs per media type;
- supported extensions;
- per-type upload limits;
- `default_ensemble_method`;
- `min_stacking_coverage`;
- `memory_optimization`. When true, each model is unloaded after every request. That saves RAM but makes each request slower.

Data: users and history are stored in SQLite at `/app/data/truthlens_history.db`, on the `api-data` Docker volume. Rebuilding containers keeps the data. `docker compose down -v` deletes it.

## Python SDK

`sdk/truthlens_sdk` is the shared base class for the model services: `TruthLensModel` plus the HTTP server started by `truthlens serve`.

To run its tests:

```bash
cd sdk
pip install -e . pytest "httpx<0.28"
pytest
```
