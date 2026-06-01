# BioIntel v1 Data Models

This document defines beginner-readable TypeScript data models for the mock-data MVP. These models are designed for local files and React state in v1, while leaving room for future API-backed data.

## Type conventions

- Prefer string union types for controlled values.
- Prefer simple arrays and plain objects.
- Avoid classes and unnecessary abstractions.
- Keep mock data in separate files, for example `src/data/mockSignals.ts`, `src/data/mockSources.ts`, `src/data/mockWatchlist.ts`, and `src/data/mockSettings.ts` when implementation begins.

## Core enums and unions

```ts
export type EventType =
  | 'Clinical Trial Change'
  | 'Clinical Data Readout'
  | 'Regulatory Update'
  | 'Publication'
  | 'Company Update'
  | 'Deal / Financing'
  | 'Safety Signal'
  | 'Commercial Update'
  | 'Competitive Landscape'
  | 'General Commentary';

export type ImportanceLevel = 'major' | 'standard' | 'compact';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type SourceStatus =
  | 'Confirmed primary source'
  | 'Company-reported'
  | 'Peer-reviewed'
  | 'Trade-reported'
  | 'Speculative';

export type SourceType =
  | 'Primary source'
  | 'Industry news'
  | 'Scientific literature'
  | 'Financial filing'
  | 'Company source'
  | 'Noisy / social source';

export type TrustLevel = 'very high' | 'high' | 'medium' | 'low';

export type BiasRisk = 'low' | 'medium' | 'high';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type WatchlistType =
  | 'Disease'
  | 'Company'
  | 'Drug / asset'
  | 'Mechanism'
  | 'Keyword / theme';

export type AnalysisMode = 'Scientist' | 'Consultant' | 'Investor' | 'Beginner';

export type SourceMix = 'Primary only' | 'Balanced' | 'Broad';

export type TimeWindow = 'Last 24h' | '3 days' | '7 days';

export type BriefingLength = 5 | 10 | 20;

export type DetailLevel = 'quick skim' | 'standard' | 'detailed analyst';
```

## Signal

A `Signal` is the main product object. It is a structured biotech event, not a raw article.

```ts
export interface Signal {
  id: string;
  headline: string;
  eventType: EventType;
  importance: ImportanceLevel;
  confidence: ConfidenceLevel;
  sourceStatus: SourceStatus;
  relevanceLabel: string;
  summary: string;
  whyItMatters: string;
  whyYouAreSeeingThis: string;
  matchedTopics: string[];
  tags: SignalTag[];
  sourceTrail: SourceTrailItem[];
  whatChanged: string[];
  relatedCompanies: string[];
  relatedDiseases: string[];
  relatedMechanisms: string[];
  suggestedActions: string[];
  evidenceStatus: EvidenceStatus;
  date: string; // ISO date string
  saved: boolean;
}
```

## SignalTag

Tags should make it easy to scan disease, company, mechanism, modality, and theme matches.

```ts
export type SignalTagType =
  | 'Disease'
  | 'Company'
  | 'Mechanism'
  | 'Modality'
  | 'Theme'
  | 'Asset';

export interface SignalTag {
  label: string;
  type: SignalTagType;
}
```

## SourceTrailItem

The source trail explains where the signal came from and what role each source played.

```ts
export type SourceRole =
  | 'Original disclosure'
  | 'Primary confirmation'
  | 'Peer-reviewed evidence'
  | 'Context'
  | 'Market reaction'
  | 'Rumor / early chatter';

export interface SourceTrailItem {
  id: string;
  sourceName: string;
  sourceType: SourceType;
  trustLevel: TrustLevel;
  role: SourceRole;
  status: SourceStatus;
  publishedAt: string; // ISO date string
  citationLabel: string;
  url?: string; // Optional mock URL only in v1
  requiresPrimaryConfirmation: boolean;
  note: string;
}
```

## EvidenceStatus

Evidence status should be visible in the detail panel and optionally summarized on cards.

```ts
export interface EvidenceStatus {
  label:
    | 'Primary-confirmed'
    | 'Peer-reviewed'
    | 'Company claim'
    | 'Secondary report'
    | 'Preliminary / speculative';
  confidence: ConfidenceLevel;
  explanation: string;
  limitations: string[];
}
```

## WatchlistItem

```ts
export interface WatchlistItem {
  id: string;
  name: string;
  type: WatchlistType;
  synonyms: string[];
  priority: PriorityLevel;
  recentSignalCount: number;
  enabled: boolean;
}
```

## Starter watchlist data

### Diseases

- Sjögren’s.
- IgAN.
- MDD.
- PTSD.
- Alzheimer’s.
- Obesity.

### Companies

- Eli Lilly.
- Novo Nordisk.
- Otsuka.
- Johnson & Johnson.
- Compass Pathways.
- GH Research.
- Recursion.
- Tempus.

### Mechanisms / themes

- anti-APRIL.
- GLP-1.
- 5-HT2A agonism.
- B-cell depletion.
- FcRn inhibition.
- AI drug discovery.
- psychedelics.
- neuropsychiatry.

## SourceDefinition

```ts
export interface SourceDefinition {
  id: string;
  name: string;
  category: SourceType;
  enabled: boolean;
  trustLevel: TrustLevel;
  priority: PriorityLevel;
  biasRisk: BiasRisk;
  requiresPrimaryConfirmation: boolean;
  usefulFor: string;
}
```

## Starter source data

```ts
export const starterSources: SourceDefinition[] = [
  {
    id: 'clinicaltrials-gov',
    name: 'ClinicalTrials.gov',
    category: 'Primary source',
    enabled: true,
    trustLevel: 'very high',
    priority: 'high',
    biasRisk: 'low',
    requiresPrimaryConfirmation: false,
    usefulFor: 'Trial starts, completions, enrollment changes, endpoint changes, and sponsor updates.',
  },
  {
    id: 'fda',
    name: 'FDA',
    category: 'Primary source',
    enabled: true,
    trustLevel: 'very high',
    priority: 'high',
    biasRisk: 'low',
    requiresPrimaryConfirmation: false,
    usefulFor: 'Regulatory approvals, labels, safety communications, advisory committees, and guidance.',
  },
  {
    id: 'sec-edgar',
    name: 'SEC EDGAR',
    category: 'Financial filing',
    enabled: true,
    trustLevel: 'very high',
    priority: 'high',
    biasRisk: 'low',
    requiresPrimaryConfirmation: false,
    usefulFor: 'Financing, M&A, risk factors, material agreements, and company disclosures.',
  },
  {
    id: 'pubmed',
    name: 'PubMed',
    category: 'Scientific literature',
    enabled: true,
    trustLevel: 'high',
    priority: 'high',
    biasRisk: 'low',
    requiresPrimaryConfirmation: false,
    usefulFor: 'Peer-reviewed biomedical literature and publication tracking.',
  },
  {
    id: 'company-press-releases',
    name: 'Company press releases',
    category: 'Company source',
    enabled: true,
    trustLevel: 'medium',
    priority: 'medium',
    biasRisk: 'high',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Company-reported data, pipeline updates, partnerships, financing, and corporate milestones.',
  },
  {
    id: 'fierce-biotech',
    name: 'Fierce Biotech',
    category: 'Industry news',
    enabled: true,
    trustLevel: 'medium',
    priority: 'medium',
    biasRisk: 'medium',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Industry context, company news, deals, layoffs, and clinical updates.',
  },
  {
    id: 'fierce-pharma',
    name: 'Fierce Pharma',
    category: 'Industry news',
    enabled: true,
    trustLevel: 'medium',
    priority: 'medium',
    biasRisk: 'medium',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Pharma commercial, regulatory, launch, and company updates.',
  },
  {
    id: 'biopharma-dive',
    name: 'BioPharma Dive',
    category: 'Industry news',
    enabled: true,
    trustLevel: 'medium',
    priority: 'medium',
    biasRisk: 'medium',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Biopharma industry reporting and market context.',
  },
  {
    id: 'endpoints',
    name: 'Endpoints',
    category: 'Industry news',
    enabled: true,
    trustLevel: 'medium',
    priority: 'medium',
    biasRisk: 'medium',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Deal activity, executive changes, clinical updates, and biotech market context.',
  },
  {
    id: 'stat',
    name: 'STAT',
    category: 'Industry news',
    enabled: true,
    trustLevel: 'high',
    priority: 'medium',
    biasRisk: 'medium',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Health, medicine, policy, and biotech reporting.',
  },
  {
    id: 'reuters',
    name: 'Reuters',
    category: 'Industry news',
    enabled: true,
    trustLevel: 'high',
    priority: 'medium',
    biasRisk: 'low',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Broad market, company, regulatory, and financing news.',
  },
  {
    id: 'nature-biotechnology',
    name: 'Nature Biotechnology',
    category: 'Scientific literature',
    enabled: true,
    trustLevel: 'high',
    priority: 'medium',
    biasRisk: 'low',
    requiresPrimaryConfirmation: false,
    usefulFor: 'Scientific advances, review articles, methods, and biotech trend context.',
  },
  {
    id: 'x-twitter-biotech',
    name: 'X / Twitter biotech accounts',
    category: 'Noisy / social source',
    enabled: false,
    trustLevel: 'low',
    priority: 'low',
    biasRisk: 'high',
    requiresPrimaryConfirmation: true,
    usefulFor: 'Early chatter, sentiment, conference reactions, and rumor discovery only.',
  },
];
```

## UserSettings

`UserSettings` should stay small in v1. These are defaults for the Today briefing, not a complex preference center.

```ts
export interface UserSettings {
  defaultBriefingLength: BriefingLength;
  defaultSourceMix: SourceMix;
  defaultAnalysisMode: AnalysisMode;
  defaultTimeWindow: TimeWindow;
  includeLowConfidenceSignals: boolean;
  includeSpeculativeSignals: boolean;
  requirePrimaryConfirmationForMajorClaims: boolean;
  defaultDetailDepth: DetailLevel;
}
```

Do not add event-priority sliders, large evidence-toggle matrices, notification preferences, account preferences, or source credentials to v1 settings. If future versions need those, add them after the mock Today workflow has been validated.

## BriefingControls

`BriefingControls` represent the active Today-page controls. They can be initialized from `UserSettings`.

```ts
export interface BriefingControls {
  briefingLength: BriefingLength;
  sourceMix: SourceMix;
  analysisMode: AnalysisMode;
  timeWindow: TimeWindow;
  activeSection: SectionFilter;
}

export type SectionFilter =
  | 'Top Signals'
  | 'Clinical Trials'
  | 'Regulatory'
  | 'Publications'
  | 'Company Updates'
  | 'Deals / Financing'
  | 'Saved';
```

## ArchiveBriefing

```ts
export interface ArchiveBriefing {
  id: string;
  date: string; // ISO date string
  generatedAt: string;
  signalCount: number;
  topSignalIds: string[];
  summary: string;
}
```

## Local UI state

The Today page can maintain local state like this:

```ts
interface TodayPageState {
  signals: Signal[];
  selectedSignalId: string | null;
  hiddenSignalIds: string[];
  lessLikeThisSignalIds: string[];
  controls: BriefingControls;
}
```
