import type {
  ImportanceLevel,
  RelevanceLabel,
  Signal,
  SignalTag,
} from "@/src/types/biointel";
import { buildTopicMatches, matchTopicsInText } from "./matching";
import type { RawSourceItem } from "./types";

const generatedAt = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
}).format(new Date());

function tagsFromTopics(item: RawSourceItem, topics: string[]): SignalTag[] {
  const searchable = `${item.title} ${item.summary}`;
  const matchedTopics = matchTopicsInText(searchable, buildTopicMatches(topics));

  if (matchedTopics.length > 0) {
    return matchedTopics.slice(0, 4).map((match) => ({
      label: match.topic,
      type: "Theme",
    }));
  }

  if (item.eventType === "Publication") {
    return [{ label: "Publication", type: "Theme" }];
  }
  if (item.eventType === "Clinical Trial") {
    return [{ label: "Clinical trial registry", type: "Theme" }];
  }
  if (item.eventType === "Safety Signal") {
    return [{ label: "Safety", type: "Theme" }];
  }
  return [{ label: "Regulatory", type: "Theme" }];
}

function matchedTopics(item: RawSourceItem, topics: string[]) {
  const searchable = `${item.title} ${item.summary}`;
  const matches = matchTopicsInText(searchable, buildTopicMatches(topics));
  return matches.length > 0
    ? matches.map((match) => match.topic)
    : ["General biotech"];
}

function importanceFor(item: RawSourceItem): ImportanceLevel {
  if (item.eventType === "Regulatory" || item.eventType === "Safety Signal") {
    return "High";
  }
  if (item.eventType === "Clinical Trial" || item.eventType === "Publication") {
    return "Medium";
  }
  return "Medium";
}

function relevanceFor(item: RawSourceItem, topics: string[]): RelevanceLabel {
  const matched = matchedTopics(item, topics);
  return matched[0] === "General biotech" ? "Adjacent" : "Core watchlist";
}

function sectionFor(item: RawSourceItem): Signal["section"] {
  if (item.eventType === "Clinical Trial") return "Clinical Trials";
  if (item.eventType === "Regulatory") return "Regulatory";
  if (item.eventType === "Publication") return "Publications";
  if (item.eventType === "Deal / Financing") return "Deals / Financing";
  return "Company Updates";
}

function metadataList(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function normalizeItemToSignal(
  item: RawSourceItem,
  topics: string[],
): Signal {
  const matchedWatchlistTopics = matchedTopics(item, topics);
  const relatedCompanies = metadataList(item.metadata?.sponsor);
  const relatedDiseases = metadataList(item.metadata?.conditions);
  const relatedMechanisms = metadataList(item.metadata?.interventions);

  return {
    id: `real-${item.sourceId}-${item.id}`,
    headline: item.title,
    eventType: item.eventType,
    importance: importanceFor(item),
    relevance: relevanceFor(item, topics),
    sourceStatus: item.sourceStatus,
    evidenceStatus: item.evidenceStatus,
    tags: tagsFromTopics(item, topics),
    summary: item.summary || "Source metadata is available, but no source summary was provided.",
    whyItMatters:
      item.eventType === "Clinical Trial"
        ? "Clinical trial registry updates can point to trial status, enrollment, sponsor, phase, or intervention context."
        : "This item comes from a public source and may be relevant to your watchlist or source settings.",
    whyYouAreSeeingThis: `Matched ${matchedWatchlistTopics.join(", ")} from your current topics, source mode, or general biotech coverage.`,
    matchedWatchlistTopics,
    sourceTrail: item.sourceTrail,
    whatChanged:
      item.eventType === "Clinical Trial"
        ? (item.changeNote ??
          "ClinicalTrials.gov record found. No prior in-memory version is available for comparison yet.")
        : "New source item found during the current server-side fetch.",
    relatedCompanies,
    relatedDiseases,
    relatedMechanisms,
    suggestedNextActions: [
      "Open the source before relying on the signal.",
      "Treat this as source metadata, not AI-written analysis.",
      item.eventType === "Clinical Trial"
        ? "Re-check after another fetch to compare against the in-memory trial snapshot."
        : "Save or hide locally to tune this session.",
    ],
    date: item.publishedAt.slice(0, 10),
    generatedAt,
    saved: false,
    section: sectionFor(item),
    origin: "Real",
    externalUrl: item.url,
  };
}
