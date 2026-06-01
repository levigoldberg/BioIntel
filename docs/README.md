# BioIntel Documentation Index

This folder contains the documentation package for BioIntel v1 and the current mock-data frontend prototype.

## Documents

1. [`product-spec.md`](./product-spec.md)
   - Product vision, goals, non-goals, page requirements, component inventory, interactions, and definition of done.

2. [`user-stories.md`](./user-stories.md)
   - Personas, epics, user stories, and acceptance criteria.

3. [`data-models.md`](./data-models.md)
   - TypeScript-oriented models for signals, source trails, watchlist items, source definitions, settings, and archive briefings.

4. [`page-wireframes.md`](./page-wireframes.md)
   - Text wireframes for Today, Watchlist, Sources, Settings, Archive, signal cards, and detail panels.

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

10. [`build-2-demo-qa.md`](./build-2-demo-qa.md)
    - Quick demo-readiness checklist for the Build 2 mock-data prototype.

## Current boundary

The app is now in a frontend-only mock-data prototype phase. Continue to avoid real ingestion, databases, authentication, scraping, RSS, Supabase, and AI summarization until explicitly requested.
