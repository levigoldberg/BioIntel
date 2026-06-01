# BioIntel Documentation Index

This folder contains the complete documentation package for BioIntel v1, a planned mock-data MVP for a personalized biotech intelligence dashboard.

## Documents

1. [`product-spec.md`](./product-spec.md)
   - Product vision, goals, non-goals, page requirements, component inventory, interactions, and definition of done.

2. [`user-stories.md`](./user-stories.md)
   - Personas, epics, user stories, and acceptance criteria.

3. [`data-models.md`](./data-models.md)
   - TypeScript-oriented models for signals, source trails, watchlist items, source definitions, settings, and archive briefings.

4. [`page-wireframes.md`](./page-wireframes.md)
   - Text wireframes for global layout, Today, Watchlist, Sources, Settings, Archive, signal cards, and detail panels.

5. [`ranking-logic.md`](./ranking-logic.md)
   - Mock ranking factors, scoring weights, source mix behavior, section filters, and pseudocode.

6. [`source-architecture.md`](./source-architecture.md)
   - Future source registry, ingestion, normalization, signal detection, source trail, evidence scoring, and briefing generation architecture.

7. [`roadmap.md`](./roadmap.md)
   - Phased roadmap from documentation through mock frontend, RSS, Supabase, OpenAI summarization, ClinicalTrials.gov, PubMed, regulatory intelligence, daily briefings, and collaboration.

8. [`implementation-plan.md`](./implementation-plan.md)
   - Suggested future file structure, mock signal guidance, and quality checklist.

9. [`v1-build-plan.md`](./v1-build-plan.md)
   - Exact order for the first implementation pass, starting with the Today-centered mock signal experience.

## Current boundary

This is a documentation-only phase. The app should not be built until a future implementation task begins. When implementation starts, build the mock-data MVP from `v1-build-plan.md` before any real ingestion, database, authentication, or AI summarization work.
