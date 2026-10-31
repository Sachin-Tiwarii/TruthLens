# TruthLens — AI-Powered Media Detection & Verification

A minimal, responsive web platform designed to detect potentially AI-generated or digitally manipulated images, audio, and videos.

TruthLens aims to make digital media verification more transparent by combining multiple AI detection models and digital forensic techniques to generate explainable verification reports.

## Overview

With the rapid growth of generative AI, distinguishing authentic media from synthetic or manipulated content has become increasingly difficult.

TruthLens addresses this challenge by providing a unified platform where users can upload media, examine potential manipulation indicators, and review evidence-backed verification results.

## Features

- **Multi-format media support** — Images, audio recordings, and videos.
- **AI-powered detection** — Designed to integrate multiple AI detection models.
- **Digital forensics** — Examination of media-specific patterns and artifacts.
- **Multi-model verification** — Combines model outputs to improve assessment reliability.
- **Explainable reports** — Verdicts, confidence scores, model results, and supporting evidence.
- **User dashboard** — Overview of verification activity.
- **Analysis history** — Search and revisit previous assessments.
- **Downloadable reports** — Printable verification reports.
- **Responsive interface** — Designed for desktop and mobile screens.
- **Demo access** — Explore the frontend using a demonstration account.

> Note: AI detection results are probabilistic, not absolute proof of authenticity or manipulation.

## Design

| Element | Value |
|---|---|
| Ivory | `#F7F5EF` |
| Forest Green | `#183D32` |
| Typography | Manrope + DM Sans |
| Styling | Plain CSS |
| Design approach | Minimal, responsive, professional |

The frontend uses plain CSS. Tailwind CSS is not required.

## Tech Stack

**Frontend**
- React
- Vite
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- Plain CSS

**Planned Backend**
- Node.js
- Express.js
- MongoDB
- Python / FastAPI for AI inference
- Multiple AI detection models
- Digital forensic processing

The backend and AI services are developed separately and will be integrated with the frontend through REST APIs.

## Project Structure

```text
TruthLens/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── UploadZone.jsx
│   │   ├── ConfidenceScore.jsx
│   │   ├── LoadingAnimation.jsx
│   │   └── VerdictBadge.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Analyze.jsx
│   │   ├── Results.jsx
│   │   ├── History.jsx
│   │   └── Report.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── analysisService.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Application Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/about` | About TruthLens |
| `/login` | User login |
| `/register` | User registration |
| `/dashboard` | Workspace overview |
| `/analyze` | Media upload interface |
| `/results/:id` | Verification result |
| `/history` | Previous analyses |
| `/report/:id` | Detailed printable report |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sachin-Tiwarii/TruthLens.git
```

### 2. Navigate to the project

```bash
cd TruthLens
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The backend URL can be changed when the backend is deployed.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## Backend Integration

The frontend is structured to communicate with the backend through centralized API services.

**API configuration:** `src/services/api.js`

**Authentication service:** `src/services/authService.js`

**Analysis service:** `src/services/analysisService.js`

### Planned API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/analysis` | Upload media and create analysis |
| GET | `/api/analysis/:id` | Retrieve analysis results |
| GET | `/api/analysis/:id/status` | Check analysis status |
| GET | `/api/analysis/history` | Retrieve analysis history |
| GET | `/api/dashboard` | Retrieve dashboard statistics |
| GET | `/api/analysis/:id/report` | Retrieve detailed report |
| GET | `/api/analysis/:id/report/pdf` | Download PDF report |

These are the proposed API contracts. Backend implementation and integration are ongoing.

### Media Analysis Workflow

```text
User uploads media
        |
        v
Backend validates and stores file
        |
        v
Media-specific AI processing
        |
        v
Multiple model predictions
        |
        v
Digital forensic examination
        |
        v
Result aggregation
        |
        v
Verdict + Confidence + Evidence
        |
        v
Explainable verification report
```

### Expected Media Support

- Images
- Audio
- Videos

Maximum frontend upload size: 100 MB. The backend must independently enforce file size, format, and content validation.

## Backend Development Documentation

For teammates implementing the backend, refer to:

`BACKEND_REQUIREMENTS.md`

This document covers:

- Backend architecture and folder structure.
- Authentication and authorization.
- Media upload and storage.
- Image, audio, and video detection pipelines.
- Multi-model orchestration and result aggregation.
- Confidence scoring and verdict categories.
- Database schema.
- API request and response structures.
- Report generation.
- Security and privacy requirements.
- Testing and integration priorities.

## Current Development Status

| Module | Status |
|---|---|
| Landing page | Frontend implemented |
| About page | Frontend implemented |
| Login and registration UI | Implemented |
| Demo access | Frontend demonstration |
| Dashboard | UI with sample data |
| Media upload interface | Frontend implemented |
| AI detection | Backend integration pending |
| Multi-model verification | Backend integration pending |
| Results and reports | UI with illustrative data |
| Analysis history | UI with sample data |
| PDF report | Frontend printable report |

**Important:** The current frontend demonstration does not perform actual AI media detection. Real verification results will be available after integration with the backend and AI services.

## Security & Privacy

The production implementation should include:

- Secure authentication and authorization.
- Password hashing.
- Private media storage.
- Server-side file validation.
- User-level analysis access control.
- Secure API configuration.
- Appropriate file retention and deletion policies.

Never commit `.env` files, credentials, API keys, or other secrets.
---

**TruthLens — A clearer way to understand what's real in a world of synthetic media.**