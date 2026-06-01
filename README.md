# BioIntel

BioIntel is a source-backed biotech and pharma intelligence dashboard. It turns public regulatory, clinical, scientific, and non-paywalled industry updates into structured BioIntel signals instead of generic article lists.

## Current Status

The app now uses a server-side Next.js ingestion route for live public sources:

- FDA RSS feeds.
- PubMed through NCBI E-utilities.
- ClinicalTrials.gov public API.
- Non-paywalled industry RSS from Fierce Biotech, Fierce Pharma, and BioPharma Dive.

The Today page starts with a general biotech/pharma overview before showing any watchlist intersections. The site does not use AI summarization, authentication, Supabase, a database, scraping, paid sources, or browser-side external source calls.

## Vercel Deployment

BioIntel is configured for Vercel through the imported GitHub repository. Pushes to the deployment branch should build with Vercel's default Next.js settings:

- Framework preset: Next.js.
- Install command: `npm install`.
- Build command: `npm run build`.
- Output directory: Next.js default.
- Required environment variables: none for the current public-source build.

GitHub Pages is not sufficient for this version of BioIntel because the app depends on a Next.js route handler at `/api/signals` for server-side fetching, caching, normalization, and error isolation.

The `/api/signals` route runs dynamically on Vercel, keeps external source fetching server-side, and bounds live source requests so one slow public source does not block the full function.

## App Pages

- **Today** — live general biotech/pharma briefing, source-backed signal cards, ranking explanations, source drill-down, and local save/hide/downrank interactions.
- **Watchlist** — saved browser-local topic list used to personalize matching after the general overview.
- **Sources** — saved browser-local source registry toggles with connection status, trust cues, bias risk, and confirmation requirements.
- **Settings** — saved browser-local briefing length, source mix, time window, analysis mode, evidence, and tone controls.
- **Archive** — explains current browser-local saved state and future durable archive scope.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Next.js, usually <http://localhost:3000>.

## Test the API Route

```bash
curl "http://localhost:3000/api/signals?topics=biotech,pharma,FDA,obesity&sourceMix=Balanced&timeWindow=7%20days&limit=10"
```

Supported query params:

- `topics`: comma-separated terms. If omitted, the route uses broad biotech/pharma topics.
- `sourceMix`: `Primary only`, `Balanced`, or `Broad`.
- `timeWindow`: `Last 24h`, `3 days`, or `7 days`.
- `limit`: capped server-side between 1 and 30.
- `sourceIds`: optional comma-separated connected source IDs (`src-fda`, `src-ctgov`, `src-pubmed`, `src-fierce`, `src-fiercepharma`, `src-biopharmadive`). Disabled sources are returned as `skipped` in `sourceStatuses`.

## Validate

```bash
npm run lint
npm run build
```

## Current Limitations

- No database or persistent raw item store.
- No scheduled ingestion or background jobs.
- No authentication.
- No cross-device or account-level saved signals; preferences and user actions are saved in browser `localStorage`.
- No AI summarization.
- No scraping.
- No paid/paywalled source integrations.
- No SEC EDGAR connector yet.
- ClinicalTrials.gov change detection is process-local and not persisted.
- Source summaries are metadata-derived and should not be treated as full scientific, medical, or regulatory analysis.

## Documentation

Current documentation lives in [`docs/`](./docs):

- [`docs/product-spec.md`](./docs/product-spec.md)
- [`docs/source-architecture.md`](./docs/source-architecture.md)
- [`docs/build-3-real-ingestion.md`](./docs/build-3-real-ingestion.md)
- [`docs/build-4-ingestion-quality.md`](./docs/build-4-ingestion-quality.md)
