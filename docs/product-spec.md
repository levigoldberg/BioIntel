# BioIntel v1 Product Specification

## 1. Product summary

BioIntel v1 is a polished mock-data MVP for a personalized biotech intelligence dashboard. It helps a user start the day with a concise, source-backed briefing of important biotech, pharma, clinical trial, regulatory, scientific, company, deal, financing, and competitive landscape signals.

The v1 product intentionally does **not** connect to real feeds, external APIs, authentication, or a database. It uses local mock data and React state to validate the user experience before investing in ingestion and backend infrastructure.

## 2. Product vision

BioIntel should feel like the first product a biotech professional opens every morning. It should not look or behave like a generic news reader. The core product unit is a **signal**, not an article.

A signal is a structured event or update that answers:

1. What happened?
2. Why am I seeing this?
3. Why does it matter?
4. How trustworthy is it?
5. Where did it come from?

The product should make source quality, evidence strength, and user relevance visible on every important screen.

## 3. Goals

### v1 goals

- Deliver a convincing clickable prototype using Next.js, TypeScript, Tailwind CSS, and the App Router.
- Use local mock data only.
- Make the Today page feel like a serious daily intelligence briefing.
- Demonstrate source-backed signal cards with confidence and evidence context.
- Let users locally adjust briefing controls, filters, settings, watchlist items, source toggles, save state, and hidden items.
- Provide enough product structure to support future RSS, ClinicalTrials.gov, PubMed, SEC, FDA, and AI summarization work.

### Non-goals for v1

- No authentication.
- No database.
- No real API calls.
- No RSS ingestion.
- No live scraping.
- No server-side personalization.
- No payments, teams, admin console, or sharing workflows.
- No long-term persistence beyond in-memory React state.

## 4. Target users

### Primary user archetypes

1. **Biotech operator / BD professional**
   - Tracks companies, assets, trial changes, financing, and deal activity.
   - Needs to know what changed and why it matters competitively.

2. **Scientist / translational researcher**
   - Tracks mechanisms, diseases, publications, trial data, and evidence strength.
   - Needs source quality and scientific caveats surfaced quickly.

3. **Healthcare investor / analyst**
   - Tracks catalysts, data readouts, regulatory events, financing, M&A, and market implications.
   - Needs importance ranking, confidence, and watch-next suggestions.

4. **Consultant / strategy professional**
   - Tracks landscapes across disease areas, mechanisms, companies, and modality trends.
   - Needs succinct implications and next actions.

5. **Beginner / general biotech learner**
   - Needs plain-language explanation and less jargon.
   - Benefits from analysis mode switching.

## 5. Product principles

- **Signals over articles:** group coverage around the underlying event.
- **Source trail first:** always show where a claim came from and how strong the evidence is.
- **Personal relevance:** explain why the signal is shown based on watchlist matches, topics, or priority settings.
- **Calm seriousness:** use restrained color, readable typography, subtle borders, and minimal animation.
- **Actionable brevity:** help users decide whether to save, track, ignore, or investigate.
- **Beginner-readable implementation:** favor clear components and types over clever abstractions.

## 6. MVP technical stack

- Next.js with App Router.
- TypeScript.
- Tailwind CSS.
- Local mock data files.
- React state for all interactivity.
- No external state management.
- No backend.
- No database.
- No external APIs.

## 7. Information architecture

Primary navigation:

1. **Today**
   - Personalized daily briefing.
   - Homepage and most polished page.

2. **Watchlist**
   - Tracked diseases, companies, drugs/assets, mechanisms, and keywords/themes.

3. **Sources**
   - Source categories, trust metadata, enabled/disabled controls, and confirmation requirements.

4. **Settings**
   - Briefing preferences, event priorities, evidence preferences, and tone/depth controls.

5. **Archive**
   - Past briefings, saved signals, search, and filters.

## 8. Core entities

- Signal.
- Source trail item.
- Watchlist item.
- Source.
- User settings.
- Briefing controls.
- Archive briefing.

Detailed TypeScript-oriented data models are in [`docs/data-models.md`](./data-models.md).

## 9. Required mock signal coverage

The v1 mock dataset should include at least 12 realistic signals across:

- Sjögren’s / anti-APRIL.
- IgAN.
- Psychedelics / MDD.
- GLP-1 / obesity.
- Alzheimer’s.
- AI drug discovery.
- Regulatory update.
- Clinical trial change.
- Publication.
- Deal or financing.

Each signal should contain:

- `id`.
- `headline`.
- `eventType`.
- `importance`.
- `confidence`.
- `sourceStatus`.
- `summary`.
- `whyItMatters`.
- `matchedTopics`.
- `tags`.
- `sourceTrail`.
- `whatChanged`.
- `relatedCompanies`.
- `relatedDiseases`.
- `relatedMechanisms`.
- `suggestedActions`.
- `date`.
- `saved`.

## 10. Page requirements

Detailed wireframes are in [`docs/page-wireframes.md`](./page-wireframes.md).

### Today

The Today page is the homepage. It should contain:

- Header with “BioIntel Briefing”.
- Current date.
- Mock generated time.
- Count of signals found.
- Current source mode.
- Current analysis mode.
- Quick controls:
  - Briefing length: 5, 10, 20.
  - Source mix: Primary only, Balanced, Broad.
  - Analysis mode: Scientist, Consultant, Investor, Beginner.
  - Time window: Last 24h, 3 days, 7 days.
- Main feed of signal cards.
- Desktop left-side section filter:
  - Top Signals.
  - Clinical Trials.
  - Regulatory.
  - Publications.
  - Company Updates.
  - Deals / Financing.
  - Saved.
- Desktop right-side detail panel that updates when a signal is selected.
- Responsive behavior where the detail panel stacks below the selected card or appears below the feed.

### Watchlist

The Watchlist page lets users view and edit tracked topics using local state.

Required sections:

- Diseases.
- Companies.
- Drugs / assets.
- Mechanisms.
- Keywords / themes.

Each item should show:

- Name.
- Type.
- Related synonyms or terms.
- Priority level.
- Recent signal count.
- Enabled / paused toggle.
- Edit and remove buttons.

### Sources

The Sources page shows source categories and source controls.

Required categories:

- Primary sources.
- Industry news.
- Scientific literature.
- Financial filings.
- Company sources.
- Noisy / social sources.

Each source should show:

- Source name.
- Source type.
- Enabled / disabled state.
- Trust level.
- Priority.
- Bias risk.
- Whether it requires primary confirmation.
- Short explanation of what it is useful for.

### Settings

The Settings page exposes main product knobs:

1. Briefing preferences.
2. Event priorities.
3. Evidence preferences.
4. Tone and depth.

### Archive

The Archive page includes:

- Past daily briefings.
- Saved signals.
- Filters by disease, company, mechanism, event type, and date.
- Mock saved items.
- Search bar.

## 11. Signal card requirements

Each signal card includes:

- Headline.
- Event type.
- Relevance label.
- Confidence label.
- Source status label.
- Tags for disease, company, mechanism, modality, or theme.
- One-sentence summary.
- “Why it matters” preview.
- Matched watchlist topics.
- Source trail preview.
- Actions:
  - Save.
  - Hide.
  - Less like this.
  - Track related topic.
  - Open sources.

Card sizes:

1. **Major signal card** for very important updates.
2. **Standard signal card** for normal updates.
3. **Compact signal card** for lower-priority matches.

## 12. Detail panel requirements

When a signal is selected, the right-side detail panel shows:

- Full headline.
- Why you are seeing this.
- Why it matters.
- What changed.
- Source trail with source type, trust level, and role.
- Related companies.
- Related diseases.
- Related mechanisms.
- Suggested next actions.
- Evidence status.

The source trail should be visually prominent and treated as a first-class UI component.

## 13. Ranking overview

The Today feed should rank visible signals using a transparent mock score. The score combines:

- Event importance.
- Watchlist match strength.
- Evidence confidence.
- Source quality.
- Recency.
- Event priority settings.
- Source mix setting.
- Analysis mode emphasis.
- Downranking from hidden or “less like this” interactions.

Full ranking rules and pseudocode are in [`docs/ranking-logic.md`](./ranking-logic.md).

## 14. Source architecture overview

Although v1 uses local mock data only, the information model should anticipate future source ingestion.

Future source architecture should separate:

- Source registry.
- Raw collection.
- Normalization.
- Entity extraction.
- Signal detection.
- Source trail construction.
- Deduplication.
- Ranking.
- Briefing generation.
- User feedback loops.

Full source architecture is in [`docs/source-architecture.md`](./source-architecture.md).

## 15. Component inventory

Required components:

- `AppShell`.
- `SidebarNav`.
- `BriefingHeader`.
- `QuickControls`.
- `SignalCard`.
- `SignalDetailPanel`.
- `SourceTrail`.
- `WatchlistManager`.
- `SourceManager`.
- `SettingsPanel`.
- `ArchiveList`.
- Badge components where useful.

Recommended extra components:

- `SectionFilter`.
- `PageHeader`.
- `EmptyState`.
- `ToggleSwitch`.
- `SegmentedControl`.
- `PrioritySlider`.
- `TagList`.
- `EvidenceBadge`.
- `SignalActions`.

## 16. Interaction requirements

- Clicking a signal selects it and updates the detail panel.
- Quick controls update visible state where reasonable.
- Save button toggles `saved` state.
- Hide button removes item from visible feed.
- Section filters filter the feed.
- Settings controls update local state.
- Watchlist toggles update local state.
- Source toggles update local state.
- “Open sources” should reveal or focus the source trail; it should not open real URLs in v1 unless mock URLs are added intentionally.

## 17. Definition of done for v1 prototype

- The app runs locally with `npm run dev` after dependencies are installed.
- All five primary pages are navigable.
- Today page has desktop three-column layout and acceptable mobile stacking.
- At least 12 realistic mock signals are visible through filters.
- Signal cards support three visual density levels.
- Detail panel updates from selected signal.
- Source trail is clear and visually prominent.
- Watchlist, Sources, and Settings controls are interactive using local state.
- Archive search and filters operate on mock data.
- README explains mock-data-only scope and next steps.
- AGENTS.md instructs future coding agents to preserve the mock-first approach.

## 18. Open product questions for after v1

- Should BioIntel group multiple sources into one canonical signal automatically or expose source-level articles separately?
- Which user persona should be the default analysis mode for first-time users?
- Should confidence be shown as a simple label, numeric score, or both?
- How should paywalled trade press be represented in source trails?
- How much uncertainty should be displayed in the main feed versus detail panel?
- Should source mix affect inclusion, ranking, or both?
- Should “less like this” affect only event type, topic, company, or source class?
