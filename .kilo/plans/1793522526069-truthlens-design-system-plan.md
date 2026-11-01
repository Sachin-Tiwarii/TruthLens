# TruthLens Frontend Design System Plan

## Overview
Create a premium, forensic-grade UI that aligns with the serious, evidence-first ethos of TruthLens. Reject generic AI aesthetics; adopt a dark, professional visual language with precise typography, restrained motion, and clear hierarchy.

## Design System
- **Colors**: Extend CSS variables for dark mode; define primary, surface, text, accent, risk, success, warning palettes. Use dark backgrounds (#0F1115–#161A21), muted accents (amber/gold), controlled reds, and desaturated greens/teals.
- **Typography**: Primary – Inter (700) for headings, 600 for subheads; body – Inter 400/500. Monospace – JetBrains Mono for hashes, timestamps, technical metadata.
- **Spacing & Elevation**: 8‑px baseline grid; use subtle shadows (var(--shadow)) for depth; radius 10‑16 px.
- **Iconography**: Simple line icons with accent color; avoid playful illustrations.
- **Dark Mode**: Add a `.dark` class on `<body>` that overrides CSS variables. Define dark palette variables in `:root` (e.g., `--bg-dark`, `--surface-dark`, `--text-dark`, `--accent-dark`). Ensure all components use CSS variables for colors, backgrounds, borders, and shadows.

## Component Inventory
- **Existing**: VerdictBadge, UploadZone, LoadingAnimation, Navbar, Sidebar, Card, StatCard, AnalysisTable, ResultsPage, ReportPage, HistoryPage, SettingsPage.
- **New/Adapt**: DarkModeToggle (context), DarkCard, DarkButton, DarkInput, EvidenceList, IntegritySection, ReportExportButton, ProcessingTimeline, VerificationVisual (3D prism), FloatingMediaChips.
- **Props**: Align each component’s props with backend response shapes (verdict, confidence, evidence items, hashes, timestamps, model metadata).

## Page Designs
1. **Landing / Marketing** – cinematic hero with restrained typography, hero‑trust section, minimal floating visuals.
2. **Auth / Onboarding** – secure sign‑up/login, progressive disclosure, no playful elements.
3. **Dashboard** – stats grid, analysis table, quick actions, calm layout; dark header with sticky top bar.
4. **Upload** – refined intake with progressive states (drag‑zone → processing → analysis); equal elegance for image/audio/video.
5. **Processing** – multi‑stage visual timeline (ingest → feature extraction → model analysis → fusion → report); purposeful motion.
6. **Results / Report** – forensic case‑file layout: verdict badge, confidence bar, evidence breakdown, integrity section (hashes, timestamps, model versions), expandable technical details, export to PDF/print.
7. **History / Case Library** – scannable archive with filters (media type, verdict), quick report access, clean card layout.
8. **Settings** – API keys, usage, team permissions, audit preferences; dense but clear.

## Interaction & Motion
- Motion is purposeful: progress steps, shared‑element transitions, subtle fade/scale, precise timing.
- Loading states show pipeline stages (e.g., media ingest → feature extraction → analysis → fusion → report) with progress bars and status text.
- Hover/focus states use restrained color shifts (accent‑strong) and slight elevation.
- Reduced‑motion support via `prefers-reduced-motion` media query.

## Technical Integration
- Components consume data from FastAPI via typed interfaces (e.g., `analysisResult: { verdict: string; confidence: number; evidence: EvidenceItem[]; integrity: IntegrityInfo }`).
- Dark mode colors derived from CSS variables; ensure API‑provided accent colors (amber, red) are mapped to appropriate variables.
- Use existing services (`api.js`, `analysisService.js`) for data fetching; handle loading and error states with existing LoadingAnimation and error UI components.

## Validation & Testing
- Run `npm run lint` and `npm run typecheck` to ensure style and type safety.
- Test dark mode toggle across all pages; verify contrast and readability.
- Verify responsive behavior at mobile, tablet, and desktop breakpoints.
- Conduct accessibility audit (focus‑visible, reduced motion, ARIA labels).

## Open Questions / Risks
- **Dark mode trigger**: Should we respect OS preference, provide a manual toggle, or auto‑detect? Decide on implementation approach.
- **Component hard‑coded colors**: Identify any components that use literal color values instead of CSS variables and refactor.
- **3D visual performance**: Ensure the 3D prism and orbit animations remain performant on lower‑end hardware; consider throttling or fallback for reduced‑motion preferences.

**Next Steps**
1. Extend CSS variables and implement `.dark` class in `src/styles/index.css`.
2. Create dark palette definitions and update component CSS to use variables.
3. Build new components (DarkCard, DarkButton, EvidenceList, ProcessingTimeline, VerificationVisual).
4. Redesign pages according to the brief, using the design system.
5. Implement motion and loading states.
6. Perform lint/typecheck, test dark mode, and iterate.