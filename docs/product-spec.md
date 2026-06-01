# BioIntel Product Spec

BioIntel is a personalized biotech and pharma intelligence dashboard. The product goal is to show source-backed signals, not a raw article feed.

## Core Experience

The Today page should:

- Start with a broad overview of important biotech/pharma developments.
- Use source-backed signal cards with visible trust cues.
- Show watchlist intersections only after the general overview.
- Keep the feed capped and deduped to avoid unnecessary volume.
- Preserve local interactions such as save, hide, less like this, section filters, and source inspection.

## Connected Sources

- FDA RSS feeds for regulatory and safety updates.
- PubMed through NCBI E-utilities for publication metadata.
- ClinicalTrials.gov public API for trial registry records.
- Fierce Biotech, Fierce Pharma, and BioPharma Dive RSS for non-paywalled industry context.

## Current Non-Goals

- Authentication.
- Supabase.
- Database storage.
- Scheduled ingestion.
- AI summarization.
- Scraping.
- Paid or paywalled source integrations.
- Browser-side calls to external source APIs.
- SEC EDGAR ingestion.

## Trust Model

Each signal should expose:

- Source trail.
- Source type.
- Evidence status.
- Source status.
- Trust level.
- Confirmation requirement.
- Original source link when available.

Trade press can provide context, but major clinical, regulatory, or financial claims should be treated as stronger when supported by primary sources.

## Pages

- **Today**: broad briefing, watchlist intersections, filters, cards, details, and source drill-down.
- **Watchlist**: local topic controls used for matching and personalization.
- **Sources**: connected/planned/disabled source registry with trust cues.
- **Settings**: briefing and evidence controls.
- **Archive**: inactive until persistent storage is added.

## Hosting Direction

BioIntel requires a host that runs Next.js server routes because `/api/signals` performs server-side fetching and normalization. GitHub Pages is only suitable for a static export and does not satisfy this architecture by itself.
