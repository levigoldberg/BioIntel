export type EventType =
  | "Clinical Trial"
  | "Regulatory"
  | "Publication"
  | "Company Update"
  | "Deal / Financing"
  | "Safety Signal"
  | "AI Drug Discovery";

export type ImportanceLevel = "Critical" | "High" | "Medium" | "Low";
export type RelevanceLabel = "Core watchlist" | "Adjacent" | "Exploratory";
export type SourceStatus =
  | "Primary confirmed"
  | "Primary plus coverage"
  | "Secondary only"
  | "Noisy / needs confirmation";
export type EvidenceStatus =
  | "Confirmed"
  | "Emerging"
  | "Speculative"
  | "Conflicting";
export type SourceType =
  | "Primary source"
  | "Industry news"
  | "Scientific literature"
  | "Financial filing"
  | "Company source"
  | "Noisy / social source";
export type TrustLevel = "Very high" | "High" | "Medium" | "Low";
export type SourceRole =
  | "Origin"
  | "Confirmation"
  | "Context"
  | "Market reaction";
export type WatchlistType =
  | "Disease"
  | "Company"
  | "Drug / asset"
  | "Mechanism"
  | "Keyword / theme";
export type PriorityLevel = "High" | "Medium" | "Low";
export type SourceMix = "Primary only" | "Balanced" | "Broad";
export type AnalysisMode = "Scientist" | "Consultant" | "Investor" | "Beginner";
export type TimeWindow = "Last 24h" | "3 days" | "7 days";
export type BriefingLength = 5 | 10 | 20;
export type SectionFilter =
  | "Top Signals"
  | "Clinical Trials"
  | "Regulatory"
  | "Publications"
  | "Company Updates"
  | "Deals / Financing"
  | "Saved";
export type DetailDepth = "Quick skim" | "Standard" | "Detailed analyst";
export type ToneDepth = "Concise" | "Balanced" | "Deep analyst";

export interface SignalTag {
  label: string;
  type: "Disease" | "Company" | "Mechanism" | "Asset" | "Theme";
}

export interface SourceTrailItem {
  sourceName: string;
  sourceType: SourceType;
  trustLevel: TrustLevel;
  role: SourceRole;
  status: SourceStatus;
  requiresPrimaryConfirmation: boolean;
  sourceUrl?: string;
  note: string;
}

export interface Signal {
  id: string;
  headline: string;
  eventType: EventType;
  importance: ImportanceLevel;
  relevance: RelevanceLabel;
  sourceStatus: SourceStatus;
  evidenceStatus: EvidenceStatus;
  tags: SignalTag[];
  summary: string;
  whyItMatters: string;
  whyYouAreSeeingThis: string;
  matchedWatchlistTopics: string[];
  sourceTrail: SourceTrailItem[];
  whatChanged: string;
  relatedCompanies: string[];
  relatedDiseases: string[];
  relatedMechanisms: string[];
  suggestedNextActions: string[];
  date: string;
  generatedAt: string;
  saved: boolean;
  section: SectionFilter;
}

export interface WatchlistItem {
  id: string;
  name: string;
  type: WatchlistType;
  enabled: boolean;
  priority: PriorityLevel;
  recentSignalCount: number;
  synonyms: string[];
  rationale: string;
}

export interface SourceDefinition {
  id: string;
  name: string;
  category: SourceType;
  enabled: boolean;
  trustLevel: TrustLevel;
  priority: PriorityLevel;
  biasRisk: "Low" | "Medium" | "High";
  requiresPrimaryConfirmation: boolean;
  usefulFor: string;
}

export interface BriefingSettings {
  defaultBriefingLength: BriefingLength;
  defaultSourceMix: SourceMix;
  defaultAnalysisMode: AnalysisMode;
  defaultTimeWindow: TimeWindow;
  showSpeculativeItems: boolean;
  showDuplicateCoverage: boolean;
  includeWhyItMatters: boolean;
  includeWatchNext: boolean;
  requirePrimaryConfirmation: boolean;
  detailDepth: DetailDepth;
  priorityEvents: EventType[];
  evidencePreferences: EvidenceStatus[];
  toneDepth: ToneDepth;
}

export interface BriefingControls {
  briefingLength: BriefingLength;
  sourceMix: SourceMix;
  analysisMode: AnalysisMode;
  timeWindow: TimeWindow;
}

export interface ArchivedBriefing {
  id: string;
  title: string;
  date: string;
  generatedAt: string;
  summary: string;
  topSignalIds: string[];
  savedSignalIds: string[];
  diseases: string[];
  companies: string[];
  mechanisms: string[];
  eventTypes: EventType[];
}
