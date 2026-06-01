# BioIntel v1 Build Plan

This is the implementation order for the first build. It intentionally starts with the Today page because Today is the product center and the fastest way to prove the signal-centered experience.

## Build boundary

Build a convincing mock-data MVP only:

- Use local mock data files.
- Use React state for interactivity.
- Do not add authentication.
- Do not add a database.
- Do not add real ingestion, scraping, RSS, or external API calls.
- Do not add AI summarization or background jobs.

## What to build first, in exact order

### 1. Scaffold the Next.js shell

Create the minimal app foundation:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Root layout.
- Global styles.
- Navigation with Today as the default route.

Success means the app can run locally and the empty Today route is reachable.

### 2. Add the shared types and mock data

Create local files for:

- `Signal` types.
- `SourceTrailItem` types.
- `WatchlistItem` types.
- `SourceDefinition` types.
- `UserSettings` and `BriefingControls` types.
- At least 12 realistic mock signals.
- Starter watchlist data.
- Starter source registry data.
- Simple mock archive data.

Every mock signal must include:

- A clear headline.
- Event type.
- Confidence label.
- Source status label.
- Evidence status.
- One-sentence summary.
- `whyItMatters`.
- `whyYouAreSeeingThis`.
- Matched topics.
- Source trail with source type, trust level, role, confirmation requirement, and note.
- What changed.
- Related companies, diseases, and mechanisms.
- Suggested next actions.
- Date.
- Saved state.

Success means the product can be rendered from data without hard-coded signal copy inside UI components.

### 3. Build the Today page first

Implement the homepage as the most polished page:

- Briefing header with date, mock generated time, signal count, source mix, and analysis mode.
- Quick controls for briefing length, source mix, analysis mode, and time window.
- Section filter for Top Signals, Clinical Trials, Regulatory, Publications, Company Updates, Deals / Financing, and Saved.
- Signal feed with selected state.
- Signal card variants for major, standard, and compact signals.
- Right-side detail panel on desktop.
- Mobile layout where details stack below the selected signal or feed.

Every signal card must show:

- Event type.
- Headline.
- Confidence label.
- Source status label.
- Evidence/source preview.
- One-sentence summary.
- Why it matters preview.
- Matched topics.
- Save and hide actions.

Every signal detail panel must show:

- Why you are seeing this.
- Why it matters.
- What changed.
- Full source trail.
- Evidence limitations or caveats.
- Suggested next actions.

Success means Today feels like the main product, not one page among many.

### 4. Add local Today interactions

Add only the practical v1 interactions:

- Select a signal.
- Save or unsave a signal.
- Hide a signal for the current session.
- Mark “less like this” with a visible local confirmation or light downranking.
- Add a related topic to the local watchlist.
- Change quick controls and immediately update visible results.
- Show useful empty states.

Success means a user can scan, trust-check, and triage signals in one session without persistence.

### 5. Build the support pages with simple local state

After Today works, add the remaining pages as supporting surfaces:

- Watchlist: grouped tracked topics with enabled/paused, priority, synonyms, edit mock state, remove, and add-topic mock flow.
- Sources: source categories with trust level, bias risk, enabled/disabled state, confirmation requirement, and usefulness text.
- Settings: only the practical v1 knobs listed in the settings section of the product spec.
- Archive: mock past briefings, saved signals, simple search, and simple filters.

Success means these pages explain and support Today rather than competing with it.

### 6. Add simple ranking and filtering

Implement readable local ranking helpers:

- Time-window filtering.
- Section filtering.
- Source-mix filtering/downranking.
- Watchlist relevance score.
- Source quality score.
- Confidence score.
- Recency score.
- Analysis-mode nudge.
- Hidden/saved/less-like-this state handling.

Do not build an advanced recommender. The ranking should be easy to explain in the detail panel.

Success means Top Signals appears intentionally ordered and the “why you are seeing this” text is credible.

### 7. Polish the product proof

Finish the MVP with:

- Responsive desktop and mobile layouts.
- Consistent badges for confidence, source status, evidence, and event type.
- Clear empty states.
- Accessible button labels and keyboard-friendly controls.
- README setup instructions after the app exists.
- A final check that there are no real external calls, secrets, auth flows, or database dependencies.

Success means BioIntel v1 can be demoed as a serious mock intelligence dashboard centered on source-backed signals.

## Practical v1 settings knobs

The Settings page should contain only these controls:

1. Default briefing length: 5, 10, or 20.
2. Default source mix: Primary only, Balanced, or Broad.
3. Default analysis mode: Scientist, Consultant, Investor, or Beginner.
4. Default time window: Last 24h, 3 days, or 7 days.
5. Include low-confidence signals: on/off.
6. Include speculative/noisy signals: on/off.
7. Require primary confirmation for major claims: on/off.
8. Default detail depth: Quick skim, Standard, or Detailed analyst.

Do not build event-priority sliders, dozens of evidence toggles, or a complex preference center in v1.

## Deferred until after v1

- Real source ingestion.
- RSS.
- ClinicalTrials.gov API integration.
- PubMed integration.
- FDA, SEC, or company filing integrations.
- OpenAI summarization.
- Authentication.
- Database persistence.
- Notifications and email briefings.
- Team collaboration.
- Advanced ranking personalization.
- Numeric confidence scores.
- Automated signal clustering.
