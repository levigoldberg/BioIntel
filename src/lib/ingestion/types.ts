import type {
  EventType,
  EvidenceStatus,
  SourceStatus,
  SourceTrailItem,
  SourceType,
  TrustLevel,
} from "@/src/types/biointel";

export interface IngestionQuery {
  topics: string[];
  searchTerms: string[];
  sourceMix: string;
  timeWindow: string;
  limit: number;
  mode: "Real sources";
}

export interface SourceFetchStatus {
  source: string;
  status: "ok" | "error" | "skipped";
  count: number;
  error?: string;
}

export interface RawSourceItem {
  id: string;
  sourceId: "fda" | "pubmed" | "clinical-trials" | "industry-news";
  sourceName: string;
  sourceType: SourceType;
  trustLevel: TrustLevel;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  eventType: EventType;
  sourceStatus: SourceStatus;
  evidenceStatus: EvidenceStatus;
  sourceTrail: SourceTrailItem[];
  metadata?: Record<string, string | string[] | undefined>;
  changeNote?: string;
  changeDetected?: boolean;
}

export interface SourceFetchResult {
  items: RawSourceItem[];
  status: SourceFetchStatus;
}
