# BioIntel v1 User Stories

## Personas

### Scientist

A scientist wants high-quality evidence, mechanistic context, and source quality. They care about peer-reviewed literature, clinical readouts, trial design, endpoints, safety, translational relevance, and scientific caveats.

### Consultant

A consultant wants succinct implications, competitive context, and next-step prompts. They care about market structure, stakeholder moves, partnerships, regulatory events, and how a signal changes a landscape.

### Investor

An investor wants catalysts, material changes, confidence, and relevance to companies and assets. They care about clinical data, regulatory risk, financing, M&A, commercial implications, and market-moving evidence.

### Beginner

A beginner wants clear explanation, reduced jargon, and why-this-matters context. They care about learning the landscape without losing trust in the evidence.

## Epic 1: Daily briefing

### Story 1.1: Open daily briefing

As a user, I want to open BioIntel and immediately see a structured morning briefing so that I can understand the most important biotech updates without scanning many sites.

**Acceptance criteria**

- The Today page is the homepage.
- The page header says “BioIntel Briefing.”
- The header shows current date, mock generated time, signal count, source mode, and analysis mode.
- The feed shows ranked signal cards.
- The first screen makes source quality and evidence status visible.

### Story 1.2: Adjust briefing length

As a user, I want to switch between 5, 10, and 20 signals so that I can choose between a quick skim and a broader briefing.

**Acceptance criteria**

- A segmented control exposes 5, 10, and 20.
- Selecting a value updates how many visible signals are shown.
- Selection does not require a page refresh.

### Story 1.3: Adjust source mix

As a user, I want to choose Primary only, Balanced, or Broad source mix so that I can control whether BioIntel prioritizes verified sources or wider market chatter.

**Acceptance criteria**

- Source mix control offers Primary only, Balanced, and Broad.
- Primary only excludes or strongly downranks trade-reported and speculative items.
- Balanced shows a mix of primary and reputable secondary sources.
- Broad allows lower-trust source classes but labels them clearly.

### Story 1.4: Adjust analysis mode

As a user, I want to switch between Scientist, Consultant, Investor, and Beginner modes so that the briefing emphasizes the implications I care about.

**Acceptance criteria**

- Analysis mode control offers all four modes.
- Selected mode is reflected in the header.
- Ranking and copy emphasis can change locally based on selected mode.

### Story 1.5: Adjust time window

As a user, I want to choose Last 24h, 3 days, or 7 days so that I can catch up after being away.

**Acceptance criteria**

- Time window control offers all three values.
- The feed filters mock signals by date.
- The signal count updates after filtering.

## Epic 2: Signal comprehension

### Story 2.1: Understand what happened

As a user, I want every card to state the event clearly so that I can decide whether to inspect it further.

**Acceptance criteria**

- Each card has a clear headline.
- Each card has an event type badge.
- Each card includes a one-sentence summary.

### Story 2.2: Understand why I am seeing a signal

As a user, I want to know why BioIntel included a signal so that the feed feels personalized rather than random.

**Acceptance criteria**

- Cards show matched watchlist topics.
- The detail panel includes a “Why you are seeing this” section.
- Matched topics are derived from signal fields and watchlist mock data.

### Story 2.3: Understand why a signal matters

As a user, I want concise implications so that I can quickly evaluate priority.

**Acceptance criteria**

- Cards show a “Why it matters” preview.
- Detail panel includes fuller “Why it matters” explanation.
- Suggested next actions are available for selected signals.

### Story 2.4: Understand trustworthiness

As a user, I want confidence and source status visible so that I can calibrate how much to rely on a signal.

**Acceptance criteria**

- Each card has a confidence label.
- Each card has a source status label.
- Detail panel has evidence status.
- Source trail lists source type, trust level, and role.

### Story 2.5: Inspect source trail

As a user, I want to see the source trail for a signal so that I can understand whether the information is primary, company-reported, peer-reviewed, trade-reported, or speculative.

**Acceptance criteria**

- Cards include source trail preview.
- Detail panel includes full source trail.
- Source trail visually distinguishes primary sources from secondary or noisy sources.

## Epic 3: Feed interaction

### Story 3.1: Select a signal

As a user, I want to click a signal and see details without leaving the page so that I can scan efficiently.

**Acceptance criteria**

- Clicking a card selects it.
- Detail panel updates to the selected signal.
- Selected card has a visible selected state.

### Story 3.2: Save a signal

As a user, I want to save signals so that I can revisit them later.

**Acceptance criteria**

- Save action toggles saved state locally.
- Saved signals appear under the Saved section filter.
- Saved items appear in the Archive page mock saved list.

### Story 3.3: Hide a signal

As a user, I want to hide irrelevant signals so that my feed gets cleaner during a session.

**Acceptance criteria**

- Hide action removes the item from the visible feed.
- Hidden state is local only.
- If the hidden selected signal was open, selection moves to the next visible signal when possible.

### Story 3.4: Request less like this

As a user, I want to mark a signal as “less like this” so that future ranking can learn my preferences.

**Acceptance criteria**

- The action updates local state or shows a confirmation.
- v1 can downrank similar mock signals in the current session.
- No backend persistence is required.

### Story 3.5: Track related topic

As a user, I want to add a related topic to my watchlist from a signal so that future briefings include it.

**Acceptance criteria**

- The action adds a local watchlist item or opens a simple mock flow.
- The added item has default priority and enabled state.
- No database persistence is required.

## Epic 4: Section filtering

### Story 4.1: Filter by section

As a user, I want to filter the feed by Top Signals, Clinical Trials, Regulatory, Publications, Company Updates, Deals / Financing, and Saved so that I can focus on one type of update.

**Acceptance criteria**

- Desktop layout shows a left-side section filter.
- Mobile layout shows a compact control or stacked filter.
- Feed updates immediately.
- Empty filter states show useful copy.

## Epic 5: Watchlist management

### Story 5.1: View watchlist

As a user, I want to see all tracked topics by category so that I know what BioIntel is using for personalization.

**Acceptance criteria**

- Watchlist page has sections for Diseases, Companies, Drugs / assets, Mechanisms, and Keywords / themes.
- Starter data includes specified diseases, companies, and mechanisms/themes.
- Each item shows synonyms, priority, recent signal count, enabled/paused state, edit, and remove controls.

### Story 5.2: Pause a watchlist item

As a user, I want to pause topics without deleting them so that I can temporarily reduce noise.

**Acceptance criteria**

- Toggle changes enabled/paused state locally.
- Paused items are visually distinct.
- Paused topics can reduce ranking relevance in the feed.

### Story 5.3: Edit or remove a watchlist item

As a user, I want edit and remove controls so that the watchlist feels manageable.

**Acceptance criteria**

- Edit opens a simple mock edit state or inline fields.
- Remove deletes the item from local state after user action.
- No persistence is required.

## Epic 6: Source management

### Story 6.1: View source registry

As a user, I want to see BioIntel's source categories so that I understand what it considers credible.

**Acceptance criteria**

- Sources page displays six required categories.
- Example sources are represented with trust, priority, bias risk, and usefulness explanation.

### Story 6.2: Enable or disable a source

As a user, I want to toggle sources so that I can control what appears in my briefing.

**Acceptance criteria**

- Source toggles update local state.
- Disabled sources can be downranked or excluded in the feed.
- No real source calls are made.

### Story 6.3: Understand confirmation requirements

As a user, I want to know whether a source requires primary confirmation so that I can interpret secondary and noisy sources correctly.

**Acceptance criteria**

- Each source shows whether primary confirmation is required.
- Lower-trust/noisy sources are visually labeled.

## Epic 7: Settings

### Story 7.1: Set practical briefing defaults

As a user, I want a small set of defaults so that BioIntel fits my workflow without making me configure a complex system.

**Acceptance criteria**

- Settings include default briefing length: 5, 10, or 20.
- Settings include default source mix: Primary only, Balanced, or Broad.
- Settings include default analysis mode: Scientist, Consultant, Investor, or Beginner.
- Settings include default time window: Last 24h, 3 days, or 7 days.
- Settings include default detail depth: Quick skim, Standard, or Detailed analyst.
- Controls update local state only.

### Story 7.2: Set simple trust preferences

As a user, I want a few trust controls so that I can decide how cautious the briefing should be.

**Acceptance criteria**

- Settings include Include low-confidence signals: on/off.
- Settings include Include speculative/noisy signals: on/off.
- Settings include Require primary confirmation for major claims: on/off.
- Changes update local filtering or labels in the Today briefing.
- Do not add event-priority sliders, per-evidence-type toggle grids, notification settings, account settings, or source credentials in v1.

## Epic 8: Archive

### Story 8.1: Browse past briefings

As a user, I want to see past daily briefings so that I can catch up historically.

**Acceptance criteria**

- Archive page displays mock past daily briefings.
- Each briefing shows date, signal count, and highlights.

### Story 8.2: Search and filter saved signals

As a user, I want to search and filter saved signals so that I can retrieve important updates.

**Acceptance criteria**

- Search bar filters mock saved items.
- Filters support disease, company, mechanism, event type, and date.
- Saved signals are shown in a clear list.
