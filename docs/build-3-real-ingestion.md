# Build 3 Real Ingestion

Build 3 added the first live source-backed ingestion path through a server-side Next.js route.

## Connected Sources

- **FDA RSS**
  - FDA press releases.
  - FDA MedWatch safety alerts.
  - Normalized as regulatory or safety signals.

- **PubMed**
  - NCBI E-utilities `ESearch` and `ESummary`.
  - Normalized as publication signals.
  - Includes PMID, journal metadata, authors when available, publication date, and PubMed URL.

- **ClinicalTrials.gov**
  - Public ClinicalTrials.gov v2 study search API.
  - Normalized as clinical trial signals.
  - Includes NCT ID, title, phase, status, conditions, interventions, sponsor, update date, and study URL when available.

## API Route

```bash
GET /api/signals
```

Supported query params:

- `topics`: comma-separated topic list.
- `sourceMix`: `Primary only`, `Balanced`, or `Broad`.
- `timeWindow`: `Last 24h`, `3 days`, or `7 days`.
- `limit`: max number of returned signals, capped server-side.

Example:

```bash
curl "http://localhost:3000/api/signals?topics=obesity,Alzheimer,IgA%20nephropathy&sourceMix=Balanced&timeWindow=7%20days&limit=6"
```

## Error Handling

Each source is fetched independently. If one source fails, `/api/signals` returns partial results from available sources plus source-level error metadata.

## Known Limits

- No database.
- No scheduled ingestion.
- No authentication.
- No persistent saved signals.
- No AI summarization.
- No scraping.
- No SEC EDGAR connector yet.
- No paid/paywalled source integrations.
