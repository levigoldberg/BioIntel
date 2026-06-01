# BioIntel Documentation

This folder documents the current live-source BioIntel app.

## Current Documents

- [`product-spec.md`](./product-spec.md) — product direction, page responsibilities, and current boundaries.
- [`source-architecture.md`](./source-architecture.md) — ingestion architecture, source quality model, and future backend direction.
- [`build-3-real-ingestion.md`](./build-3-real-ingestion.md) — first live-source ingestion layer.
- [`build-4-ingestion-quality.md`](./build-4-ingestion-quality.md) — caching, matching, deduplication, industry RSS, and trial change detection.

## Boundary

BioIntel currently uses server-side public source ingestion only. Continue to avoid authentication, databases, Supabase, scraping, paid sources, browser-side external source calls, and AI summarization until those are explicitly planned as separate builds.
