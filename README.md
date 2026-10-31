# TruthLens Frontend

Minimal, responsive React + Vite frontend for an AI-powered media detection and verification platform.

## Design
- Ivory: `#F7F5EF`
- Forest green: `#183D32`
- Typography: Manrope + DM Sans
- CSS is plain CSS (no Tailwind dependency required).

## Run locally
```bash
npm install
npm run dev
```

## Pages
- `/` Home
- `/about` About
- `/login` Login (local demo only)
- `/register` Register (local demo only)
- `/dashboard` Workspace overview
- `/analyze` Media upload UI
- `/results/:id` Result preview
- `/history` Analysis history
- `/report/:id` Printable report

## Backend integration
The API client is in `src/services/api.js`. Configure `VITE_API_BASE_URL` in `.env`.
The current upload/result/history content is illustrative mock data. Connect the API services to your team's backend before treating any result as a real media assessment.
