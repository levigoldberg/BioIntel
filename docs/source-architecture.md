# BioIntel Source Architecture

BioIntel uses a server-side ingestion layer to fetch public source data, normalize it into BioIntel signals, dedupe overlapping items, and expose results through `/api/signals`.

## Current Flow

```text
Public sources
      ↓
Server-side fetchers
      ↓
Raw source items
      ↓
Normalizer
      ↓
Deduplication
      ↓
Signal ranking
      ↓
Today briefing UI
```

## Current Fetchers

- `src/lib/ingestion/fda.ts`
- `src/lib/ingestion/pubmed.ts`
- `src/lib/ingestion/clinicalTrials.ts`
- `src/lib/ingestion/industryNews.ts`

The browser calls only the local `/api/signals` route. External source calls stay on the server side.

## Source Principles

1. **Primary sources are preferred for claims of fact.**
   FDA, ClinicalTrials.gov, PubMed records, SEC filings, and original company disclosures should carry clear trust labels.

2. **Industry news adds context.**
   Non-paywalled trade publications help identify events and market framing, but important claims should still be confirmed against primary sources when possible.

3. **Source trail is product-critical.**
   Every signal should expose where it came from, why the source is trusted or limited, and whether confirmation is required.

4. **Keep ingestion auditable.**
   Normalization should preserve IDs, URLs, dates, and source metadata so future persistence can store raw items cleanly.

## API Route

`app/api/signals/route.ts` reads:

- `topics`
- `sourceMix`
- `timeWindow`
- `limit`

It returns:

- `signals`
- `sourceStatuses`
- `warnings`
- `cacheStatus`
- `mode`

If one source fails, the route still returns available partial results.

## Caching

The current cache is in-memory and process-local. It improves local responsiveness but is not a durable ingestion store.

## Future Backend Direction

The next durable architecture should add:

- Raw source item storage.
- Scheduled ingestion.
- Persistent signal records.
- User accounts and saved items.
- Clinical trial history tables for durable diffing.
- Deployment monitoring and source failure logging.

Those changes should be implemented before adding any AI summarization layer.
