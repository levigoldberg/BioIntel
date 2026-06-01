# BioIntel

BioIntel is a personalized biotech intelligence dashboard that transforms biotech, pharma, clinical trial, regulatory, and scientific updates into a daily source-backed briefing. It is designed around biotech **signals**: structured, source-backed events such as clinical trial changes, FDA/regulatory updates, company press releases, new publications, clinical data readouts, deals, financing events, and competitive landscape updates.

## Project status

BioIntel Build 2 is now a working **frontend-only mock-data prototype** that builds on the Build 1 briefing experience. The current app uses:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Local mock data only.
- React state for interactions.
- No authentication.
- No database.
- No external APIs, scraping, RSS ingestion, Supabase, or OpenAI API calls.

## Build 1 pages

- **Today** — the polished homepage and morning briefing experience with source-backed signal cards, controls initialized from shared Settings, filters, local save/hide/downrank actions, source drill-down, ranking explanations, and responsive detail panels.
- **Watchlist** — grouped mock watchlist topics with enable/pause, remove, and edit-looking local controls.
- **Sources** — source registry grouped by source type with local enable/disable toggles and trust cues.
- **Settings** — practical briefing, evidence, and tone/depth knobs backed by a lightweight client-side preferences context.
- **Archive** — mock past briefings and saved signals with search and filtering.

## How to install dependencies

```bash
npm install
```

## How to run locally

```bash
npm run dev
```

Then open the local URL printed by Next.js, usually <http://localhost:3000>.

## How to validate the build

```bash
npm run lint
npm run build
```

## Documentation

The complete v1 product documentation lives in [`docs/`](./docs):

- [`docs/product-spec.md`](./docs/product-spec.md) — complete product specification.
- [`docs/user-stories.md`](./docs/user-stories.md) — personas, epics, user stories, and acceptance criteria.
- [`docs/data-models.md`](./docs/data-models.md) — TypeScript-oriented data models for signals, sources, watchlist items, and settings.
- [`docs/page-wireframes.md`](./docs/page-wireframes.md) — text wireframes for Today, Watchlist, Sources, Settings, and Archive.
- [`docs/ranking-logic.md`](./docs/ranking-logic.md) — mock ranking algorithm, scoring factors, filters, and pseudocode.
- [`docs/source-architecture.md`](./docs/source-architecture.md) — source registry and future ingestion architecture.
- [`docs/roadmap.md`](./docs/roadmap.md) — phased roadmap from mock MVP to ingestion, persistence, and daily briefing generation.
- [`docs/implementation-plan.md`](./docs/implementation-plan.md) — recommended file structure and build sequence.
- [`docs/v1-build-plan.md`](./docs/v1-build-plan.md) — exact implementation order for the first mock-data MVP build.
- [`docs/build-2-demo-qa.md`](./docs/build-2-demo-qa.md) — quick Build 2 demo-readiness checklist.

## v1 mock-data-only scope

BioIntel v1 validates the product experience before real ingestion is added. It uses local mock data for:

- Signals.
- Source trails.
- Watchlist items.
- Source settings.
- User preferences.
- Archive items.

The v1 build intentionally does not include real APIs, external feeds, authentication, or a database.

## Suggested next step

Build 3 should preserve the mock-data-first boundary while improving the product proof: add persistence for local preferences, richer source-comparison views, saved briefing export, and demo-script polish before introducing real ingestion.
