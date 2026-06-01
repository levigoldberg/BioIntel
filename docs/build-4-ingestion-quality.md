# Build 4 Ingestion Quality Layer

Build 4 improves the live ingestion path without adding authentication, a database, Supabase, scraping, browser-side external source calls, paid sources, or AI summarization.

## What Changed

- Added lightweight in-memory server caching.
- Added topic matching that expands local watchlist terms through synonyms.
- Added source deduplication that merges repeated signals and combines source trails.
- Added first-pass in-memory ClinicalTrials.gov change detection.
- Added non-paywalled industry RSS aggregation for Fierce Biotech, Fierce Pharma, and BioPharma Dive.

## Caching

Caching is process-local and in memory:

- FDA and PubMed source fetches cache for five minutes.
- ClinicalTrials.gov source fetches cache for two minutes.
- `/api/signals` responses cache for one minute.

Cache contents disappear when the Next.js process restarts.

## Topic Matching

The ingestion route maps requested topics to enabled local watchlist items and synonyms. Matching is lightweight string matching, not biomedical entity normalization.

## Industry News Aggregation

Connected non-paywalled industry sources:

- Fierce Biotech.
- Fierce Pharma.
- BioPharma Dive.

These sources are treated as industry context. Major claims still require primary confirmation.

## Deduplication

Signals are deduplicated by source URL, clinical trial URL/NCT ID, or normalized title key. When duplicates are merged:

- Source trails are combined.
- Matched topics are combined.
- Tags are combined.
- Source status can upgrade when additional coverage supports the same signal.

## ClinicalTrials.gov Change Detection

The server stores an in-memory snapshot by NCT ID and compares later fetches within the same process. It checks:

- Status.
- Phase.
- Sponsor.
- Conditions.
- Interventions.
- Last update date.

Known limits:

- No persisted trial history.
- No database-backed diffing.
- No scheduled polling.
- Route and source caching can delay comparisons.
- A process restart clears all snapshots.
