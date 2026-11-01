# TruthLens

**Forensic-grade verification for AI-generated images, audio, and video.**

TruthLens is a multimodal media-authenticity platform. It does not return a naked probability. It returns a verdict, a calibrated confidence, the evidence that produced it, and an integrity trail a journalist, investigator, or counsel can defend.

| | |
|---|---|
| Stage | Prototype → productized verification platform |
| Stack | React + Vite frontend · FastAPI gateway (derived from DeepSafe) · 9 detector models as Docker services · SQLite |
| Category | Synthetic-media detection + provenance |
| Buyer | Newsrooms, forensic teams, legal/compliance, platforms, BFSI identity teams |
| Wedge | Explainable, hybrid forensic reports — not another black-box score |

**Developers:** run it with [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md). The API contract the UI depends on is in [frontend/BACKEND_REQUIREMENTS.md](frontend/BACKEND_REQUIREMENTS.md).

> **Note: the live demo uses mock data.** We couldn't find a free hosting service with enough RAM for our backend. Each detector model uses up to ~2 GB once loaded, and the default stack (API + 3 models) needs about 8 GB. Free tiers usually offer 512 MB–1 GB. The deployed frontend therefore shows sample analyses from [`frontend/src/data/mockData.js`](frontend/src/data/mockData.js), and sign-in is local to the browser. To see real detection, run the backend locally (below).

### Run it locally

**Prerequisites:** Git, Node.js (LTS) + npm, and Docker Desktop for the backend (on Windows, use the WSL 2 backend and give Docker at least 8 GB of memory).

1. **Clone the repo**

   ```bash
   git clone https://github.com/Sachin-Tiwarii/TruthLens.git
   cd TruthLens
   ```

2. **Start the frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open <http://localhost:5173>, then click **Try demo** or sign in with any email and password. The frontend expects the API at `http://localhost:8000`. To use a different URL, copy `.env.example` to `.env` and change `VITE_API_BASE_URL`.

3. **Start the backend (optional, for real detection)**: in a second terminal, from the repo root:

   ```bash
   cd backend
   cp .env.example .env          # set SECRET_KEY: python -c "import secrets; print(secrets.token_hex(32))"
   docker compose up -d --build  # API + NPR + UniversalFakeDetect + Cross Efficient ViT
   ```

   The first build downloads PyTorch and the model weights, so it takes a while. When it finishes, check <http://localhost:8000/health>, then try `POST /detect` at <http://localhost:8000/docs>. Stop the backend with `docker compose stop`.

   The frontend pages still show mock data even when the backend is running, because they haven't been connected to the API yet. Use the API docs page to test real detection.

---

## 1. The problem, in numbers

| Signal | Figure | Source |
|---|---|---|
| Deepfake detection market, 2025 | **USD 0.71–0.92 billion** | Meticulous Research USD 0.71B; SNS Insider USD 918.6M |
| Same market, 2026 | **~USD 0.99–1.19 billion** | Meticulous USD 0.99B; SNS USD 1.19B |
| 2035 forecast (high case) | **USD 12.14 billion** | SNS Insider, 29.5% CAGR 2026–2035 |
| 2036 forecast (base case) | **USD 9.44 billion** | Meticulous Research, 25.3% CAGR 2026–2036 |
| Recorded deepfake fraud losses | **USD 1.56 billion** cumulative; **>USD 1 billion in 2025 alone** | Surfshark dataset, reported Nov 2025 |
| Prior baseline | USD 130M (2019–2023) → ~USD 400M (2024) | Same dataset |
| Voice deepfake fraud attempts | **+1,300% in 2024** (1/month → 7/day) across 1.2B calls | Pindrop 2025 Voice Intelligence Report |
| Organizations hit by at least one deepfake incident | **84%** | IRONSCALES 2026 Cybersecurity Threat Report |
| Average loss among victims | **~USD 280k (2025), ~USD 225k (2026)** | IRONSCALES 2026 |
| Orgs investing in deepfake defense | **48% in 2026, up from 37%; 63% spent nothing the year before** | IRONSCALES 2026 |
| Document deepfakes | Projected **~40×** rise in 2026 vs 2025 (attempts) | Shufti Deepfake Identity Fraud Index 2026 |
| Single-incident scale | **EUR 95 million** wired after an AI executive impersonation (Fideuram / Intesa, 2026) | Public reporting, Oct 2026 |
| Software / API share of detection spend | **~74%** of 2025 market | SNS Insider |
| Video share of modality | **~39%**; audio is the fastest-growing modality (**~34.6% CAGR**) | SNS Insider |
| Services growth | Forensic / integration / managed detection **~33.8% CAGR** | SNS Insider |
| Cloud deployment | **~71%** of 2025 deployments | SNS Insider |
| Geography | North America largest; **Asia-Pacific fastest** | Meticulous, SNS |
| US federal judges who had seen a deepfake evidence challenge (survey, early 2026) | **15 of 931** | US Judicial Conference / FJC |
| OpenAI + Meta to that same panel (Oct 2026) | Detection will not stay reliable as generators improve | Reuters, 15 Oct 2026 |

Analyst houses do not agree on the exact dollar figure. They agree on the shape: a sub-billion category in 2025, a **9–13×** expansion by the mid-2030s, and a fraud loss curve that already jumped an order of magnitude in a single year.

The product gap is narrower than the market gap. Most paid tools return a score. Courts, news desks, and fraud teams need a **file they can put in front of a human who will be cross-examined**.

---

## 2. What TruthLens sells

One job: take a media object and produce a **verification package**.

| Output | Why a buyer pays | Built today |
|---|---|---|
| Verdict | `Likely authentic` / `Potentially synthetic` / `Inconclusive` | Authentic / synthetic. `Inconclusive` on model disagreement is planned |
| Confidence | Includes disagreement between models, not a single overconfident number | Ensemble score plus every model's own score. Not yet calibrated |
| Evidence list | Metadata anomalies, visual/audio artifacts, model votes, conflicting signals | Model votes, per-model scores, models that failed or were skipped. Metadata planned |
| Integrity block | SHA-256 of the bytes, analysis id, timestamps, model names and versions | SHA-256, request id, UTC timestamp, size, models run, ensemble method. Model versions planned |
| Provenance read | Existing C2PA Content Credentials, kept separate from our independent analysis | Planned |
| Export | PDF / JSON report a desk editor or counsel can file | Printable report (browser PDF). JSON export planned |

C2PA answers “who signed this file.” Detection answers “do the pixels and samples look synthetic.” Neither is sufficient alone. TruthLens is designed to show both, and to say when they conflict; detection ships today, C2PA reading is on the roadmap.

---

## 3. Architecture

<img src="docs/architecture.svg" alt="TruthLens Architecture" width="100%" />



<hr>


| Layer | Responsibility | Implementation |
|---|---|---|
| Client | Intake, progress, case library, report UI | React + Vite, Zustand, axios (`frontend/`) |
| API | Auth (JWT), upload checks, SHA-256, history, report data | FastAPI gateway derived from [DeepSafe](https://github.com/siddharthksah/DeepSafe) (`backend/api`) |
| Routing + fusion | Pick detectors by media type, skip models that are down, combine scores | `config/truthlens_config.json`; XGBoost stacking when ≥ 85% of models answered, otherwise average |
| Detectors | 7 image models, 1 video model, 1 audio model | One Docker service each (`backend/models`), CPU inference |
| Store | Users, analyses, hashes, full per-model results | SQLite on a Docker volume |
| Later | EXIF/C2PA checks, model versions, hash cache, background jobs, on-prem worker | Roadmap |

Design rule: **the client never invents a verdict.** It renders the report the API already computed. Adding a detector means adding a Docker service and a config entry, not rewriting the UI.

---

## 4. Workflow

<img src="docs/request-flow.svg" alt="TruthLens analysis request flow" width="100%" />


<hr>

| Stage | What is measured | Failure mode we refuse to hide | Built today |
|---|---|---|---|
| 1. Ingest | Hash, type, size | Unsupported or oversized file → hard fail, no score | Yes |
| 2. Metadata | EXIF, container, C2PA if present | Stripped metadata is a signal, not “clean” | Planned |
| 3. Detectors | Model-specific artifacts | A single model vote is not a verdict | Yes; no model answering → error, not a verdict |
| 4. Fusion | Agreement, conflict, coverage | Conflict above threshold → `INCONCLUSIVE` | Partly: stacking needs 85% coverage, else average. `INCONCLUSIVE` planned |
| 5. Seal | Hash of input, hash of report, versions | Report without versions is not exportable | Partly: input hash + request id stored. Report hash and versions planned |

---

## 5. Market and where the money sits

Use **USD 0.9 billion (2025) → USD 1.0–1.2 billion (2026) → USD 9–12 billion (2035–36)** as the planning band. Do not pitch a single CAGR as fact. The defensible statement is **25–30% CAGR** across the two most-cited 2026 forecasts.

| Segment (2025 mix, SNS) | Share | What they buy | TruthLens fit |
|---|---|---|---|
| Software / API | 73.6% | Per-scan or committed volume | Core. Self-serve API + annual commit |
| Services | rest, 33.8% CAGR | Integration, managed forensics | Year-2 margin, not year-1 headcount |
| Video | 39.2% | Frame + temporal checks | In scope |
| Audio | fastest, ~34.6% CAGR | Voice-clone screening | In scope; price higher per minute |
| Identity / KYC | 29.8% of application | Liveness-adjacent checks | Partner, do not rebuild a KYC suite |
| Media and elections | fastest application, ~36% CAGR | Desk tools + evidence packs | Beachhead |

**Beachhead math (illustrative, not a forecast).**

| Motion | Price | Volume to USD 1M ARR | Why it is realistic |
|---|---|---|---|
| Self-serve Pro | USD 299 / month | ~280 accounts | One newsroom seat or a small investigations team |
| API overage | USD 0.05 / scan | 20M scans | Inside a platform already paying for moderation |
| Business | USD 1,200 / month | ~70 accounts | Team + audit log + export |
| Enterprise | USD 40k–150k / year | 10–25 logos | One fraud, legal, or broadcast buyer |

Blended target for a first commercial year after the pilot: **USD 0.4–0.8M ARR** from API + 15–40 paying teams. That is a seed outcome, not a Series A outcome. Series A requires **USD 2–4M ARR**, gross margin **>65%** after inference optimization, and **8–15** logos that renew.

Gross margin lever is inference, not price. The gateway already calls only the detectors for the file's media type and skips models that are down. Caching by SHA-256 (planned) means a viral clip is paid once and served many times.

---

## 6. Competition — gaps we can actually win

Funding figures below are **disclosed or widely reported**, not valuations. Treat ranges as directional.

| Player | What they sell | Reported capital (approx.) | Advantage they have | Gap we use |
|---|---|---|---|---|
| Reality Defender | Multimodal enterprise API | ~USD 33–44M raised; ~94 staff (PitchBook, 2026) | Distribution, ensemble, bank/broadcast logos | Reports still optimized for a trust score more than a cross-examinable file |
| Hive | Moderation API at scale | Industry write-ups cite ~USD 120M; customers include large UGC platforms | Throughput, human-review queues | Detection is a feature inside moderation, not a forensic product |
| Sensity | Visual deepfakes + threat intel | Small disclosed rounds (low-single-digit to mid-teens USD M, conflicting public tallies) | Face-centric monitoring | Narrow modality; not a unified audio+image+video evidence pack |
| Pindrop | Voice fraud in the call path | Large, late-stage (debt + equity historically >USD 200M cited in category roundups) | Embedded in contact centers | Not a general media verifier for a newsroom |
| GetReal Labs | Synthetic-media forensics | ~USD 17.5M Series A (2024, category roundups) | Academic credibility (Farid) | US enterprise sales motion; price and access exclude smaller desks |
| Truepic / C2PA camp | Capture-time provenance | Truepic ~USD 26M Series B (2021) | Signed at the camera | Useless on files that were never signed — most of the open web |
| Microsoft / Meta / OpenAI tools | Platform-native labels and watermarks | Balance-sheet products | Distribution | Oct 2026 testimony: watermarks are not interoperable and detection will not stay scientific |

**Where incumbents are strong:** scale, logos, call-center embedding, UGC throughput.

**Where the category is weak — and where TruthLens is specified to be strong:**

1. **Conflict handling.** A 91% model and a clean container should not collapse into one green badge.
2. **Court posture.** As of October 2026, US federal rules for deepfake exhibits (draft FRE 901(c) and Rule 707) are **not adopted**. Judges still authenticate under existing rules. A proprietary score with no method, no version, and no hash is the artifact opposing counsel attacks. OpenAI told the Advisory Committee on Evidence Rules there may not be a durable scientific detector for images. Provenance + a written method is what still holds.
3. **Buyer who is not a platform.** A 12-person digital desk cannot buy a six-figure moderation contract. They can buy a report.
4. **Asia-Pacific price and presence.** Fastest-growing region, almost no product localized for Indian newsrooms, regional broadcasters, or law-firm investigations.

We do not out-raise Reality Defender on brand in year one. We out-specify them on **the artifact the user keeps**: the report.

---

## 7. How we get it in front of users

```mermaid
flowchart TD
  A[Free: 20 scans / month + basic verdict] --> B[Paid report: USD 15-40 each]
  B --> C[Pro seat: USD 299 / month]
  C --> D[API key inside a CMS or TIP]
  D --> E[Annual: USD 40k+ with SLA]
  F[Design partners: 5 newsrooms or fact-check desks] --> C
  G[1 forensic / law-firm pilot] --> E
```

| Month | Action | Success metric |
|---|---|---|
| 0–3 | Ship image + short video. Public sample reports. No cold enterprise team. | 500 accounts, 30 paying reports or Pro seats |
| 3–6 | API. Two integrations: one newsroom CMS, one fact-check workflow. | 3 design partners on a written pilot |
| 6–12 | Audio. Audit export. First annual contract. India + one English-language international desk. | USD 40k+ logo **or** USD 25k MRR |
| 12–24 | On-prem worker for banks and government. Channel: legal-tech and broadcast SIs. | 8 logos, net revenue retention >110% |

Distribution that matches the product:

- **Journalists** find it because the report is pasteable into a CMS, not because of ads.
- **Platforms** find it because the API is one endpoint (`POST /detect`) and, once the hash cache ships, idempotent on hash.
- **Counsel** finds it because the PDF states method, limits, and versions in the first two pages.

Do not lead with “AI that detects AI.” Lead with **time-to-defensible-decision**.

---

## 8. Impact, stated as a change in the user’s day

| User | Today | With a TruthLens report |
|---|---|---|
| Desk editor | Gut-check + a vendor badge they cannot explain on air | 10–15 minutes to a verdict they can read aloud, with the conflicting signals visible |
| Fact-checker | Separate EXIF tools, one image model, a notes doc | One case file: hash, models, metadata, fusion |
| Investigator | A score that dies under cross-examination | Method, versions, reproducibility, known limits — still needs a human expert, but the expert has a record |
| Fraud ops | Call-center voice tools that never see the video | Same case id across image, voice note, and clip |
| Platform trust team | Moderation queue optimized for takedown | Takedown **plus** an evidence object if the case escalates |

What we do **not** claim:

- We do not claim court admissibility. No detector has that as a property. We claim the report is **built to the inputs courts already ask for**: integrity, method, versions, limitations.
- We do not claim a stable accuracy number. Generators move. Every report lists which models ran and each one's score; refusing a verdict when coverage is thin is the next fusion rule to ship.
- We do not claim to replace a forensic examiner on a criminal file.

---

## 9. Startup path

| Round | Use of capital | Proof required before the next round |
|---|---|---|
| Build (now) | Working multimodal prototype, 1 report format, public repo discipline | Demo on unseen files; `INCONCLUSIVE` actually fires |
| Pre-seed / seed · USD 750k–1.5M | 18 months: inference cost, 2 modalities in production, 5 design partners, 1 security review | USD 25–40k MRR **or** 3 paid pilots with renewal language |
| Seed extension / Series A · USD 6–12M | Enterprise security, on-prem, sales in NA + India, model-refresh budget | USD 2–4M ARR, logo concentration <25% of revenue, gross margin >65% |

**Team shape at seed (6–8 people):** 2 backend/ML, 1 forensic engineer, 1 frontend, 1 design-partner lead (ex-newsroom or ex-fraud), 1 founder on product and capital. Do not hire a field sales team before ten conversations have produced a repeatable objection list.

**Unit economics we will not fake:**

| Line | Target by month 18 |
|---|---|
| Cost per image scan | < USD 0.01 |
| Cost per video minute | < USD 0.08 |
| Gross margin, blended | 70%+ |
| Payback on a Pro logo | < 2 months at self-serve CAC |
| Enterprise CAC payback | < 9 months |

**Moat, in order of how real it is:**

1. Report format and audit schema — switching cost once a newsroom’s lawyers have accepted the template.
2. Fusion policy and evaluation set — the rules for `INCONCLUSIVE` are the product.
3. Hash-indexed cache and regional latency — APAC desks will not wait on a US-only queue.
4. Model roster — perishable. Budget a quarterly refresh, do not call the current models a moat.

**Risks a serious investor will ask, and the answer:**

| Risk | Answer |
|---|---|
| Detection collapses as generators improve | Hybrid forensics + explicit uncertainty. We sell the trail, not a permanent accuracy claim. OpenAI already told judges pure detection will not hold. |
| Incumbent ships “explainability” | They can. Our advantage is price, report-first UX, and APAC access while they sell to banks. Speed matters more than novelty. |
| Liability if we are wrong | Verdict language is probabilistic. Terms cap liability to fees paid. High-stakes use requires a named human reviewer. We do not offer a guarantee of authenticity. |
| GPU cost | Conditional routing + hash cache. Video is metered, not unlimited. |
| Regulation (EU AI Act Art. 50 marking, US evidence rules) | Marking duties sit on **generators and deployers**, not on detectors. Our product is the verifier those deployers will be asked to show. |

---

## 10. 18-month scoreboard

| KPI | Month 6 | Month 12 | Month 18 |
|---|---|---|---|
| Paying teams | 15 | 40 | 80 |
| ARR | USD 80k | USD 350k | USD 900k |
| Scans / month | 50k | 400k | 1.5M |
| % scans served from hash cache | 20% | 40% | 55% |
| Reports exported | 200 | 1,500 | 5,000 |
| Design-partner NPS (editors) | — | >40 | >50 |
| Share of revenue from one logo | <40% | <30% | <25% |

These are operating targets, not promises. Miss month 6 and the plan changes. Do not raise Series A on a slide.

---

## 11. What “good” looks like in the room

Judges and investors should be able to repeat four lines after five minutes:

1. The category is already **~USD 1 billion** and the cited 10-year range is **USD 9–12 billion**.
2. Fraud losses crossed **USD 1 billion in a single year (2025)**; defenses are still mostly scores.
3. TruthLens sells the **report**: verdict, conflict, hash, model versions.
4. Money enters as **scans, seats, and annual evidence contracts**, starting with desks that cannot buy Hive or Reality Defender.

Everything else in this document is support for those four lines.

---

## Sources (figures, not endorsements)

- Meticulous Research, Deepfake Detection Market 2026–2036: 2025 USD 0.71B; 2026 USD 0.99B; 2036 USD 9.44B; CAGR 25.3%.
- SNS Insider, Deepfake Detection Market: 2025 USD 918.6M; 2035 USD 12.14B; CAGR 29.5%; software/API 73.6%; video 39.2%; cloud 71.4%; services CAGR 33.8%; audio CAGR 34.6%; identity verification 29.8%.
- Surfshark deepfake-loss dataset, as reported November 2025: USD 1.56B cumulative; >USD 1B in 2025; ~USD 400M in 2024; USD 130M across 2019–2023.
- Pindrop, 2025 Voice Intelligence and Security Report: +1,300% deepfake fraud attempts in 2024 on >1.2B calls.
- IRONSCALES, 2026 Cybersecurity Threat Report commentary (Oct 2026): 84% saw an incident; average victim loss ~USD 280k (2025) and ~USD 225k (2026); 48% now investing vs 37%.
- Shufti, Deepfake Identity Fraud Index 2026: document-deepfake attempts projected ~40× (3,892%) in 2026 vs 2025, annualized from Jan–May.
- Reuters, 15 Oct 2026: OpenAI and Meta briefing to the US Judicial Conference Advisory Committee on Evidence Rules. FJC survey: 15 of 931 responding judges had seen a deepfake challenge.
- PitchBook / public round reporting: Reality Defender raised about USD 43.9M, ~94 employees (2026 profile); Series A USD 15M (TechCrunch, Oct 2023). Hive, Sensity, GetReal, Pindrop, Truepic figures are category roundups and should be re-checked before a data room.
- Product repos: [TruthLens](https://github.com/Sachin-Tiwarii/TruthLens) (this repo); [DeepSafe](https://github.com/siddharthksah/DeepSafe) (origin of the API gateway and model services).

*Market figures are third-party estimates. They disagree with each other. The README uses ranges on purpose. Replace any cell with a paid primary source before it goes into a data room.*