# BioIntel

BioIntel is a personalized biotech intelligence dashboard that transforms biotech, pharma, clinical trial, regulatory, and scientific updates into a daily source-backed briefing. It is designed around biotech **signals**: structured, source-backed events such as clinical trial changes, FDA/regulatory updates, company press releases, new publications, clinical data readouts, deals, financing events, and competitive landscape updates.

## Project status

This repository currently contains the **v1 product specification and planning documentation only**. The application has not been built yet.

The planned v1 application will use:

- Next.js.
- TypeScript.
- Tailwind CSS.
- App Router.
- Local mock data only.
- React state for interactions.
- No authentication.
- No database.
- No external APIs.

## Documentation

The complete v1 product documentation lives in [`docs/`](./docs):

- [`docs/product-spec.md`](./docs/product-spec.md) — complete product specification.
- [`docs/user-stories.md`](./docs/user-stories.md) — personas, epics, user stories, and acceptance criteria.
- [`docs/data-models.md`](./docs/data-models.md) — TypeScript-oriented data models for signals, sources, watchlist items, and settings.
- [`docs/page-wireframes.md`](./docs/page-wireframes.md) — text wireframes for Today, Watchlist, Sources, Settings, and Archive.
- [`docs/ranking-logic.md`](./docs/ranking-logic.md) — mock ranking algorithm, scoring factors, filters, and pseudocode.
- [`docs/source-architecture.md`](./docs/source-architecture.md) — source registry and future ingestion architecture.
- [`docs/roadmap.md`](./docs/roadmap.md) — phased roadmap from mock MVP to ingestion, persistence, and daily briefing generation.
- [`docs/implementation-plan.md`](./docs/implementation-plan.md) — recommended future file structure and build sequence.
- [`docs/v1-build-plan.md`](./docs/v1-build-plan.md) — exact implementation order for the first mock-data MVP build.

## How to install dependencies

There are no application dependencies yet because the app has not been scaffolded.

When the build phase begins, install dependencies after scaffolding the Next.js project, for example:

```bash
npm install
```

## How to run locally

There is no runnable app yet. After the future Next.js build is implemented, the expected local command will be:

```bash
npm run dev
```

## v1 mock-data-only scope

BioIntel v1 should validate the product experience before real ingestion is added. It should use local mock data for:

- Signals.
- Source trails.
- Watchlist items.
- Source settings.
- User preferences.
- Archive items.

The v1 build should not include real APIs, external feeds, authentication, or a database unless explicitly requested later.

## Suggested next step

Build the mock-data MVP in the order defined in [`docs/v1-build-plan.md`](./docs/v1-build-plan.md). Real ingestion, Supabase, OpenAI summarization, ClinicalTrials.gov tracking, PubMed integration, and daily briefing generation are intentionally deferred until after the v1 prototype proves the Today-centered signal workflow.
