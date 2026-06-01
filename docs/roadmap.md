# BioIntel Phased Roadmap

## Phase 0: Product specification and mock-first plan

**Status:** current documentation phase.

### Goals

- Define product scope and constraints.
- Specify pages, components, mock data, interactions, source model, ranking, and future architecture.
- Preserve “do not build yet” boundary.

### Deliverables

- Product specification.
- User stories.
- Data models.
- Page wireframes.
- Ranking logic.
- Source architecture.
- README updates.
- AGENTS.md coding-agent instructions.
- v1 build plan with Today-first implementation order.

## Phase 1: Mock-data frontend MVP

### Goals

Build the clickable local prototype using only mock data, starting with the Today page and its source-backed signal workflow.

### Technical scope

- Next.js.
- TypeScript.
- Tailwind CSS.
- App Router.
- Local mock data.
- React state only.
- No authentication.
- No database.
- No external APIs.

### Product scope

- App shell and navigation.
- Today page.
- Watchlist page.
- Sources page.
- Settings page.
- Archive page.
- At least 12 realistic mock signals.
- Source trails on cards and detail panels.
- Interactive local controls.

### Success criteria

- User can run locally and click around a convincing prototype.
- Today page is clearly the center of the product and the most polished route.
- Every visible signal has source transparency, a confidence label, and “why it matters.”
- Source quality is visually obvious.
- Settings are practical defaults, not an overwhelming preference center.
- Controls feel useful even though state is local.

## Phase 2: RSS ingestion foundation

Do not begin this phase until the mock-data MVP in Phase 1 is built and reviewed.


### Goals

Add first real ingestion layer for relatively simple source feeds while preserving mock-data fallback.

### Candidate sources

- Company press release RSS feeds.
- Industry news RSS feeds.
- Select journal/news feeds where allowed.

### Technical scope

- Server-side ingestion jobs.
- Raw item storage.
- Source registry persistence.
- Basic normalization.
- Deduplication by URL and content hash.

### Product scope

- Source page can show last fetched time.
- Signals can show real source URLs.
- Clear labeling when a signal is generated from RSS.

## Phase 3: Supabase persistence

### Goals

Persist users, settings, watchlists, saved signals, hidden signals, and ingested source data.

### Technical scope

- Supabase project.
- Database schema.
- Row-level security when auth is introduced.
- Tables for sources, raw items, normalized items, signals, source trails, settings, watchlists, and feedback.

### Product scope

- Settings persist between sessions.
- Watchlist persists.
- Saved/archive data persists.
- Multiple users can eventually have separate personalization.

## Phase 4: OpenAI summarization and signal extraction

### Goals

Use AI to convert raw source items into structured signals and concise briefing language.

### Technical scope

- Server-side OpenAI calls only.
- Structured outputs for signal extraction.
- Prompt and schema versioning.
- Source-grounded summarization.
- Human-readable confidence and caveat generation.

### Product scope

- Better summaries.
- Stronger “why it matters.”
- Persona-specific analysis modes.
- More useful suggested next actions.

### Guardrails

- Every generated claim should map back to source trail items.
- Generated summaries should not invent facts.
- Low-confidence source trails should produce cautious language.

## Phase 5: ClinicalTrials.gov tracking

### Goals

Add high-value clinical trial intelligence.

### Technical scope

- Trial record ingestion.
- NCT identifier tracking.
- Trial diffing.
- Status, enrollment, endpoint, arm, sponsor, and date change detection.
- Watchlist matching by disease, company, asset, mechanism, and NCT ID.

### Product scope

- Trial change signals.
- “What changed” diff summaries.
- Trial-specific source trail.
- Alerts for material endpoint, enrollment, status, and completion changes.

## Phase 6: PubMed integration

### Goals

Add scientific literature monitoring.

### Technical scope

- PubMed query ingestion.
- PMID-based deduplication.
- Entity extraction for diseases, mechanisms, companies, modalities, and assets.
- Publication type and evidence quality labels.

### Product scope

- Publication signals.
- Peer-reviewed evidence badges.
- Literature context for company and clinical claims.
- Optional beginner explanations of scientific findings.

## Phase 7: FDA and regulatory intelligence

### Goals

Add regulatory source monitoring.

### Technical scope

- FDA approvals, labels, safety communications, guidance, advisory committee calendars, and selected document monitoring.
- Regulatory event classification.
- Company and disease/entity matching.

### Product scope

- Regulatory update signals.
- Label-change and safety signals.
- Advisory committee and decision-date context.

## Phase 8: Daily briefing generation

### Goals

Generate daily briefings automatically from ranked signals.

### Technical scope

- Scheduled jobs.
- Per-user ranking.
- Briefing snapshot persistence.
- Email or notification-ready output.

### Product scope

- Daily briefing archive.
- Morning generated timestamp.
- “What changed since yesterday” summaries.
- Saved briefing history.

## Phase 9: Advanced personalization and collaboration

### Goals

Make BioIntel adaptive and team-ready.

### Potential features

- Personalized ranking from behavior.
- Team watchlists.
- Shared saved signals.
- Notes and annotations.
- Export to PDF or email.
- Portfolio/import workflows.
- Catalyst calendar.
- Competitive landscape maps.

## Cross-phase engineering principles

- Keep the UI source-backed.
- Preserve auditability from briefing text to sources.
- Keep components focused and readable.
- Add complexity only when product value requires it.
- Avoid introducing real APIs into the frontend.
- Do not expose secrets.
- Preserve a mock-data mode for demos and testing.
