# BioIntel v1 Ranking Logic

BioIntel v1 should rank mock signals in a way that feels credible and transparent. The ranking does not need to be statistically sophisticated. It should be easy to explain, easy to adjust, and simple enough for a beginner-readable codebase.

## Ranking goals

The Today feed should prioritize signals that are:

1. Important.
2. Relevant to the user's watchlist.
3. Supported by trustworthy sources.
4. Recent.
5. Aligned with the user's chosen analysis mode.
6. Aligned with simple event-type base nudges.
7. Consistent with source mix and the small v1 settings model.

## Ranking output

The ranker should return:

```ts
interface RankedSignal {
  signal: Signal;
  score: number;
  reasons: string[];
}
```

The `reasons` array can power “Why you are seeing this” text.

## Base scoring weights

Suggested v1 score is a 0-100 style score. It can exceed 100 before final clamping, but final UI can clamp or normalize.

| Factor | Suggested max contribution |
| --- | ---: |
| Importance | 25 |
| Watchlist relevance | 25 |
| Source quality | 15 |
| Recency | 10 |
| Event type base nudge | 10 |
| Analysis mode fit | 5 |
| Interaction penalties | negative |

## Importance score

```ts
const importanceScore = {
  major: 25,
  standard: 15,
  compact: 7,
}[signal.importance];
```

## Watchlist relevance score

Watchlist score should consider matched topics and priority.

```ts
const watchlistPriorityScore = {
  high: 9,
  medium: 6,
  low: 3,
};
```

Suggested rules:

- Add priority score for each enabled watchlist match.
- Add only 1 point for paused item matches.
- Cap total watchlist score at 25.
- Add a reason for the strongest matches.

Example:

```ts
function getWatchlistScore(signal: Signal, watchlist: WatchlistItem[]) {
  let score = 0;
  const reasons: string[] = [];

  for (const item of watchlist) {
    const matches = signal.matchedTopics.includes(item.name)
      || signal.tags.some((tag) => tag.label === item.name)
      || item.synonyms.some((synonym) => signal.matchedTopics.includes(synonym));

    if (!matches) continue;

    if (item.enabled) {
      score += watchlistPriorityScore[item.priority];
      reasons.push(`Matched ${item.priority}-priority watchlist topic: ${item.name}`);
    } else {
      score += 1;
    }
  }

  return { score: Math.min(score, 25), reasons };
}
```

## Source quality score

Source quality should reward primary and peer-reviewed support.

```ts
const trustScore = {
  'very high': 15,
  high: 12,
  medium: 7,
  low: 2,
};
```

Suggested rules:

- Use the highest trust level in the source trail as a starting point.
- Add 3 bonus points if there are two or more independent source classes.
- Subtract 5 points if the only source is a company source with high bias risk.
- Subtract 8 points if the strongest source is a noisy/social source.
- Cap source score at 15.

## Recency score

Suggested recency scoring:

| Age | Score |
| --- | ---: |
| 0-24 hours | 10 |
| 1-3 days | 7 |
| 4-7 days | 4 |
| Older than 7 days | 0 |

The active time window should filter out signals older than the selected range.

## Event type emphasis

Do not build event-priority sliders in v1. Event type emphasis should come from simple defaults and the active analysis mode. For example, Scientist can lightly boost publications and clinical data, while Investor can lightly boost catalysts, regulatory events, financing, and deals.

Suggested event-type base nudges:

| Event type | Base nudge |
| --- | ---: |
| Clinical Data Readout | 4 |
| Regulatory Update | 4 |
| Clinical Trial Change | 3 |
| Safety Signal | 4 |
| Publication | 3 |
| Deal / Financing | 3 |
| Company Update | 2 |
| Commercial Update | 2 |
| Competitive Landscape | 2 |
| General Commentary | 0 |

Use these as transparent constants in code. Do not expose them as user settings in v1.

## Analysis mode score

Analysis mode should nudge ranking, not dominate it.

### Scientist

Boost:

- Publications.
- Clinical data readouts.
- Clinical trial changes.
- Mechanism-specific signals.
- Peer-reviewed or primary-confirmed evidence.

### Consultant

Boost:

- Competitive landscape.
- Company updates.
- Regulatory events.
- Deals/licensing.
- Signals with clear suggested next actions.

### Investor

Boost:

- Clinical data readouts.
- Regulatory events.
- Deals/financing.
- Safety signals.
- Commercial updates.
- Material company changes.

### Beginner

Boost:

- Signals with clear source status and evidence status.
- Major signals with clear explanatory summaries.
- Signals with lower jargon tags.

Suggested scoring:

```ts
function getAnalysisModeScore(signal: Signal, mode: AnalysisMode): number {
  if (mode === 'Scientist') {
    if (['Publication', 'Clinical Data Readout', 'Clinical Trial Change'].includes(signal.eventType)) return 5;
    if (signal.sourceStatus === 'Peer-reviewed') return 4;
  }

  if (mode === 'Consultant') {
    if (['Competitive Landscape', 'Company Update', 'Regulatory Update', 'Deal / Financing'].includes(signal.eventType)) return 5;
  }

  if (mode === 'Investor') {
    if (['Clinical Data Readout', 'Regulatory Update', 'Deal / Financing', 'Safety Signal'].includes(signal.eventType)) return 5;
  }

  if (mode === 'Beginner') {
    if (signal.importance === 'major' && signal.sourceStatus === 'Confirmed primary source') return 5;
    if (signal.sourceStatus === 'Confirmed primary source') return 3;
  }

  return 0;
}
```

## Source mix behavior

Source mix should affect both filtering and ranking.

### Primary only

- Include primary sources, scientific literature, financial filings, FDA, SEC, ClinicalTrials.gov, and PubMed-backed signals.
- Exclude or strongly downrank speculative and noisy/social-only signals.
- Company press-release-only stories should be included only if high relevance or high importance and clearly labeled.

### Balanced

- Include primary, scientific, company, financial, and reputable industry news.
- Downrank noisy/social-only items.
- Require source status labels to remain visible.

### Broad

- Include all enabled source categories.
- Allow speculative or noisy items only with clear evidence and source labels.
- Do not allow noisy items to outrank primary-confirmed major signals unless watchlist relevance is exceptional.

## Section filtering

Section filters should apply before briefing length is enforced.

| Section | Rule |
| --- | --- |
| Top Signals | Show all eligible ranked signals, with major and high-score items first. |
| Clinical Trials | Event type is Clinical Trial Change or Clinical Data Readout. |
| Regulatory | Event type is Regulatory Update. |
| Publications | Event type is Publication. |
| Company Updates | Event type is Company Update, Commercial Update, Competitive Landscape, or Safety Signal. |
| Deals / Financing | Event type is Deal / Financing. |
| Saved | Signal `saved` is true. |

## Interaction penalties

V1 local interactions can adjust ranking:

- Hidden signals are excluded.
- “Less like this” can downrank signals that share event type, tags, or source status.
- Paused watchlist topics reduce relevance contribution.

Suggested penalty:

```ts
const lessLikeThisPenalty = hasSimilarLessLikeThisSignal ? -12 : 0;
```

## Overall pseudocode

```ts
function rankSignals({
  signals,
  watchlist,
  settings,
  controls,
  hiddenSignalIds,
  lessLikeThisSignalIds,
}: RankSignalsInput): RankedSignal[] {
  return signals
    .filter((signal) => !hiddenSignalIds.includes(signal.id))
    .filter((signal) => isWithinTimeWindow(signal.date, controls.timeWindow))
    .filter((signal) => passesSectionFilter(signal, controls.activeSection))
    .filter((signal) => passesSimpleSettings(signal, settings))
    .filter((signal) => passesSourceMix(signal, controls.sourceMix))
    .map((signal) => {
      const reasons: string[] = [];
      const watchlist = getWatchlistScore(signal, watchlistItems);
      reasons.push(...watchlist.reasons);

      const score =
        getImportanceScore(signal) +
        watchlist.score +
        getSourceQualityScore(signal) +
        getRecencyScore(signal.date) +
        getEventTypeBaseNudge(signal.eventType) +
        getAnalysisModeScore(signal, controls.analysisMode) +
        getInteractionPenalty(signal, lessLikeThisSignalIds, signals);

      return { signal, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, controls.briefingLength);
}
```

## User-facing ranking explanation

The detail panel's “Why you are seeing this” section can combine:

- Watchlist matches.
- Event type relevance.
- Source status.
- Recency.
- Analysis mode fit.

Example:

> You are seeing this because it matches your high-priority Sjögren’s and anti-APRIL watchlist topics, is a clinical trial update, and includes a primary source trail.

## Future ranking improvements

- Entity-level user preference learning.
- User-level embeddings for topic matching.
- Deduplication across articles and source types.
- Novelty detection against prior briefings.
- Catalyst calendar awareness.
- Portfolio/watchlist weighting.
- Team-level preferences.
- Feedback-driven ranking model.
