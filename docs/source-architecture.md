# BioIntel Source Architecture

BioIntel v1 uses local mock data only. This document describes the future source architecture the mock-data MVP should anticipate without implementing any live integrations yet.

## v1 architecture boundary

For v1, source data should be represented as local mock objects:

- Mock source registry.
- Mock signal source trails.
- Mock evidence labels.
- Mock publication dates.
- Optional mock URLs only if useful for UI realism.

The v1 application should not call RSS feeds, APIs, scrapers, search engines, LLM APIs, databases, or authentication providers.

## Source principles

1. **Primary sources are preferred for claims of fact.**
   - FDA, ClinicalTrials.gov, SEC filings, PubMed-indexed literature, company filings, and original company disclosures should be marked clearly.

2. **Company sources are useful but biased.**
   - Press releases and corporate presentations can identify events quickly, but major claims should usually require confirmation.

3. **Trade press adds context, not final truth.**
   - Industry news can explain market implications and reactions but should not be treated as the sole source for major clinical or regulatory claims when primary sources are available.

4. **Noisy/social sources are discovery inputs only.**
   - Social posts can surface early chatter but should be low-trust, clearly labeled, and primary-confirmation-gated.

5. **The source trail is part of the product.**
   - BioIntel's value depends on showing why a signal is trustworthy, not just summarizing it.

## Future pipeline overview

```text
Source registry
      ↓
Collectors / connectors
      ↓
Raw source item store
      ↓
Normalizer
      ↓
Entity extraction
      ↓
Signal detection
      ↓
Deduplication and clustering
      ↓
Source trail builder
      ↓
Evidence and confidence scoring
      ↓
Personalized ranking
      ↓
Briefing generation
      ↓
User feedback loop
```

## Layer 1: Source registry

The source registry defines the sources BioIntel knows about.

Fields:

- Source name.
- Source category.
- Trust level.
- Priority.
- Bias risk.
- Enabled/disabled status.
- Confirmation requirement.
- Ingestion method.
- Polling cadence.
- Rate limit notes.
- Useful-for description.

V1 representation: local `SourceDefinition[]` mock data.

Future representation: database table plus admin controls.

## Layer 2: Collectors / connectors

Future collectors should fetch raw items without interpreting them too deeply.

Potential connectors:

- RSS ingestion for industry news and company press release feeds.
- ClinicalTrials.gov API or change tracking.
- PubMed / NCBI E-utilities.
- FDA endpoints, approvals, labels, guidance pages, advisory committee calendars.
- SEC EDGAR company filings.
- Company investor relations pages.
- Conference abstract sources.
- Optional social/noisy source collectors.

Collector output should preserve raw source metadata:

- Source ID.
- Title.
- Raw text or excerpt.
- Published date.
- URL.
- Authors or organization.
- Raw payload.
- Retrieval timestamp.

## Layer 3: Raw source item store

Raw items should be stored before normalization so the system can audit and reprocess them.

Future fields:

```ts
interface RawSourceItem {
  id: string;
  sourceId: string;
  title: string;
  rawText: string;
  url?: string;
  publishedAt: string;
  retrievedAt: string;
  rawPayload: unknown;
  contentHash: string;
}
```

V1 should not implement this store; mock source trails are enough.

## Layer 4: Normalization

Normalization converts raw items into a common shape.

Future normalized fields:

- Canonical title.
- Summary candidate.
- Clean body text.
- Source category.
- Source trust metadata.
- Date.
- URL.
- Mentioned entities.
- Candidate event type.

## Layer 5: Entity extraction

Entity extraction identifies and normalizes:

- Companies.
- Drugs/assets.
- Diseases.
- Mechanisms.
- Modalities.
- Targets.
- Trial phases.
- Regulatory bodies.
- Dates and milestones.
- Financial amounts.

Future implementation may combine dictionaries, biomedical ontologies, and LLM-assisted extraction.

V1 should emulate this by hand-authored `relatedCompanies`, `relatedDiseases`, `relatedMechanisms`, `tags`, and `matchedTopics` fields.

## Layer 6: Signal detection

Signal detection determines whether one or more source items represent a meaningful event.

Candidate signal types:

- Clinical trial change.
- Clinical data readout.
- Regulatory update.
- Publication.
- Company update.
- Deal / financing.
- Safety signal.
- Commercial update.
- Competitive landscape update.
- General commentary.

Future detection methods:

- Rule-based source/event patterns.
- Trial status diffing.
- Regulatory page monitoring.
- Filing item classification.
- Publication keyword and entity extraction.
- LLM-assisted event extraction.

## Layer 7: Deduplication and clustering

Multiple articles often describe the same underlying event. BioIntel should cluster them into one signal.

Future deduplication keys:

- Same company + asset + disease + event type + date window.
- Similar headline embeddings.
- Shared source URLs.
- Shared trial ID, NCT number, PMID, FDA document ID, or SEC accession number.

Output should be one signal with multiple source trail items.

## Layer 8: Source trail builder

The source trail builder attaches the evidence chain to each signal.

Source trail roles:

- Original disclosure.
- Primary confirmation.
- Peer-reviewed evidence.
- Context.
- Market reaction.
- Rumor / early chatter.

The UI should show source trail items as first-class objects, not footnotes.

## Layer 9: Evidence and confidence scoring

Confidence should be derived from:

- Source trust levels.
- Whether a primary source confirms the claim.
- Number of independent source classes.
- Whether the claim is company-only.
- Whether the claim is peer-reviewed.
- Whether the source is speculative or noisy.
- Recency and consistency between sources.

Suggested future confidence labels:

- High: primary-confirmed, peer-reviewed, or independently corroborated by high-trust sources.
- Medium: reputable secondary source or company-reported with plausible context.
- Low: noisy, speculative, incomplete, or not yet primary-confirmed.

## Layer 10: Personalized ranking

Ranking combines signal-level evidence with user preferences:

- Watchlist matches.
- Analysis mode.
- Event-type emphasis and analysis mode nudges.
- Source preferences.
- Evidence preferences.
- User feedback.

See [`docs/ranking-logic.md`](./ranking-logic.md).

## Layer 11: Briefing generation

Future briefing generation should produce:

- A ranked list of signals.
- Concise summaries.
- Why-it-matters analysis.
- Watch-next prompts.
- Source-quality caveats.
- Persona-specific framing.

This is where future OpenAI summarization can be introduced.

## Layer 12: User feedback loop

Future feedback signals:

- Saved.
- Hidden.
- Less like this.
- Track related topic.
- Source opened.
- Detail panel viewed.
- Search and archive interactions.

Feedback should improve ranking without hiding why decisions were made.

## Source category behavior

### Primary sources

Examples:

- ClinicalTrials.gov.
- FDA.
- SEC EDGAR.

Behavior:

- Highest trust.
- Strong ranking boost.
- Suitable for primary confirmation.
- Can support high-confidence signals.

### Industry news

Examples:

- Fierce Biotech.
- Fierce Pharma.
- BioPharma Dive.
- Endpoints.
- STAT.
- Reuters.

Behavior:

- Useful for context and timely discovery.
- Should often require primary confirmation for major claims.
- Trust varies by publication and claim type.

### Scientific literature

Examples:

- PubMed.
- Nature Biotechnology.

Behavior:

- Strong for evidence and scientific context.
- Peer-reviewed status should be visible.
- Preprints and abstracts should be labeled separately in future versions.

### Financial filings

Examples:

- SEC EDGAR.

Behavior:

- High-trust source for material corporate disclosures, financing, risk factors, and agreements.
- Often useful for investor mode.

### Company sources

Examples:

- Company press releases.
- Investor relations pages.

Behavior:

- Useful for original disclosure.
- Bias risk should be visible.
- Major claims should often require confirmation.

### Noisy / social sources

Examples:

- X / Twitter biotech accounts.

Behavior:

- Disabled by default in v1 mock source controls.
- Low trust.
- Requires primary confirmation.
- Should not dominate ranking.

## Future database tables

When adding Supabase, likely tables include:

- `sources`.
- `raw_source_items`.
- `normalized_source_items`.
- `entities`.
- `signals`.
- `signal_sources`.
- `watchlist_items`.
- `user_settings`.
- `saved_signals`.
- `hidden_signals`.
- `feedback_events`.
- `daily_briefings`.

## Security and compliance notes for future phases

- Never expose API keys in client code.
- Keep ingestion secrets server-side.
- Respect source terms of use.
- Store only necessary user preference data.
- Maintain auditability from generated summaries back to source items.
