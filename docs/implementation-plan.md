# BioIntel v1 Implementation Plan

This plan is for the future build phase. The application should not be built during the documentation phase. When the build starts, follow `docs/v1-build-plan.md` as the source of truth for exact implementation order.

## Recommended file structure for the build phase

```text
src/
  app/
    layout.tsx
    page.tsx
    watchlist/page.tsx
    sources/page.tsx
    settings/page.tsx
    archive/page.tsx
  components/
    AppShell.tsx
    SidebarNav.tsx
    BriefingHeader.tsx
    QuickControls.tsx
    SignalCard.tsx
    SignalDetailPanel.tsx
    SourceTrail.tsx
    WatchlistManager.tsx
    SourceManager.tsx
    SettingsPanel.tsx
    ArchiveList.tsx
    badges/
      ConfidenceBadge.tsx
      EventTypeBadge.tsx
      SourceStatusBadge.tsx
  data/
    mockSignals.ts
    mockSources.ts
    mockWatchlist.ts
    mockSettings.ts
    mockArchive.ts
  lib/
    ranking.ts
    filters.ts
    dates.ts
  types/
    biointel.ts
```

## Build sequence

Use [`v1-build-plan.md`](./v1-build-plan.md) for the exact first-build order. The sequence below remains a supporting checklist and should not be used to justify building non-v1 features early.

### Step 1: Scaffold app

- Create Next.js project structure if missing.
- Add TypeScript and Tailwind CSS.
- Configure App Router.
- Add global styles.

### Step 2: Add types and mock data

- Add shared TypeScript types.
- Add at least 12 mock signals.
- Add source definitions.
- Add starter watchlist.
- Add mock settings.
- Add mock archive items.

### Step 3: Build shared layout

- Implement `AppShell`.
- Implement `SidebarNav`.
- Add responsive layout behavior.

### Step 4: Build Today page

- Implement `BriefingHeader`.
- Implement `QuickControls`.
- Implement section filter.
- Implement `SignalCard` variants.
- Implement `SignalDetailPanel`.
- Implement `SourceTrail`.
- Add local state for selected, saved, hidden, less-like-this, and controls.
- Add filtering and ranking.

### Step 5: Build Watchlist page

- Implement `WatchlistManager`.
- Add local toggles, edit mock controls, and remove behavior.
- Group items by type.

### Step 6: Build Sources page

- Implement `SourceManager`.
- Group sources by category.
- Add local enabled/disabled toggles.
- Show trust level, priority, bias risk, confirmation requirement, and usefulness.

### Step 7: Build Settings page

- Implement `SettingsPanel`.
- Add only the practical v1 settings: default length, source mix, analysis mode, time window, low-confidence inclusion, speculative/noisy inclusion, primary-confirmation requirement, and detail depth.
- Keep settings local.
- Do not add event-priority sliders, notification preferences, account settings, source credentials, or large evidence-toggle matrices.

### Step 8: Build Archive page

- Implement `ArchiveList`.
- Add mock past briefings.
- Add search and filters.
- Show saved signals.

### Step 9: Polish and test

- Test desktop layout.
- Test mobile responsiveness.
- Test all local interactions.
- Verify no external calls are present.
- Update README if setup differs.

## Mock signal guidance

Include at least these example themes:

1. Sjögren’s anti-APRIL trial update.
2. IgAN anti-APRIL clinical data or trial milestone.
3. Psychedelic MDD update involving 5-HT2A agonism.
4. PTSD neuropsychiatry update.
5. GLP-1 obesity commercial or clinical update.
6. Alzheimer’s publication or biomarker update.
7. AI drug discovery company update involving Recursion or Tempus.
8. FDA/regulatory update.
9. ClinicalTrials.gov trial status change.
10. PubMed-indexed publication.
11. Deal or licensing update.
12. Financing event.

## Quality checklist

- Components are focused and readable.
- TypeScript types are explicit.
- Mock data is separate from UI components.
- No authentication is added.
- No database is added.
- No external APIs are called.
- Source quality is prominent.
- Today page is built first and remains the most polished page.
- Controls are interactive locally.
- Mobile layout is usable.
