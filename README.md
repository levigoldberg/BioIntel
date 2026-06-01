# BioIntel

BioIntel is a source-backed biotech and pharma intelligence dashboard. It turns public regulatory, clinical, scientific, and non-paywalled industry updates into structured BioIntel signals instead of generic article lists.

## Current Status

The app now uses a server-side Next.js ingestion route for live public sources:

- FDA RSS feeds.
- PubMed through NCBI E-utilities.
- ClinicalTrials.gov public API.
- Non-paywalled industry RSS from Fierce Biotech, Fierce Pharma, and BioPharma Dive.

The Today page starts with a general biotech/pharma overview before showing any watchlist intersections. The site does not use AI summarization, authentication, Supabase, a database, scraping, paid sources, or browser-side external source calls.

## Hosting

GitHub Pages is not sufficient for this version of BioIntel because the app depends on a Next.js route handler at `/api/signals` for server-side fetching, caching, normalization, and error isolation.

Use a host that can run Next.js server routes, such as:

- Vercel.
- Netlify with Next.js runtime support.
- Render.
- Railway.
- Fly.io.

GitHub Pages would only work if BioIntel became a static export and the ingestion API moved to a separate backend.

## App Pages

- **Today** — live general biotech/pharma briefing, source-backed signal cards, ranking explanations, source drill-down, and local save/hide/downrank interactions.
- **Watchlist** — local topic list used to personalize matching after the general overview.
- **Sources** — source registry with connection status, trust cues, bias risk, and confirmation requirements.
- **Settings** — briefing length, source mix, time window, analysis mode, evidence, and tone controls.
- **Archive** — placeholder until persistent storage is added.

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

## Validate

```bash
npm run lint
npm run build
```

## Current Limitations

- No database or persistent raw item store.
- No scheduled ingestion or background jobs.
- No authentication.
- No persistent saved signals.
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
