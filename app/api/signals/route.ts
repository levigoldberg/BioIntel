import { NextResponse } from "next/server";
import { generalBiotechTopics } from "@/src/data/defaultData";
import { fetchClinicalTrialItems } from "@/src/lib/ingestion/clinicalTrials";
import { cacheKey, getCachedValue, setCachedValue } from "@/src/lib/ingestion/cache";
import { dedupeSignals } from "@/src/lib/ingestion/dedupe";
import { fetchFdaItems } from "@/src/lib/ingestion/fda";
import { fetchIndustryNewsItems } from "@/src/lib/ingestion/industryNews";
import { buildTopicMatches, searchTermsFromMatches } from "@/src/lib/ingestion/matching";
import { normalizeItemToSignal } from "@/src/lib/ingestion/normalize";
import { fetchPubMedItems } from "@/src/lib/ingestion/pubmed";
import type { IngestionQuery, SourceFetchResult } from "@/src/lib/ingestion/types";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

const connectedSourceIds = [
  "src-fda",
  "src-ctgov",
  "src-pubmed",
  "src-fierce",
  "src-fiercepharma",
  "src-biopharmadive",
];
const industrySourceIds = [
  "src-fierce",
  "src-fiercepharma",
  "src-biopharmadive",
];

function parseLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(Math.max(parsed, 1), 30);
}

function parseTopics(value: string | null) {
  if (!value) {
    return generalBiotechTopics;
  }

  return value
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function parseSourceIds(value: string | null) {
  if (value === null) return new Set(connectedSourceIds);

  return new Set(
    value
      .split(",")
      .map((sourceId) => sourceId.trim())
      .filter((sourceId) => connectedSourceIds.includes(sourceId)),
  );
}

function sourceLimit(totalLimit: number) {
  return Math.max(2, Math.ceil(totalLimit / 4));
}

function daysForWindow(timeWindow: string) {
  if (timeWindow === "Last 24h") return 1;
  if (timeWindow === "7 days") return 7;
  return 3;
}

function isInsideWindow(date: string, timeWindow: string) {
  const then = new Date(`${date}T12:00:00Z`).getTime();
  if (Number.isNaN(then)) return true;
  const age = Date.now() - then;
  return age <= daysForWindow(timeWindow) * 24 * 60 * 60 * 1000;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topics = parseTopics(searchParams.get("topics"));
  const enabledSourceIds = parseSourceIds(searchParams.get("sourceIds"));
  const topicMatches = buildTopicMatches(topics);
  const searchTerms = searchTermsFromMatches(topicMatches);
  const query: IngestionQuery = {
    topics,
    searchTerms: searchTerms.length > 0 ? searchTerms : topics,
    sourceMix: searchParams.get("sourceMix") ?? "Balanced",
    timeWindow: searchParams.get("timeWindow") ?? "3 days",
    limit: parseLimit(searchParams.get("limit")),
    mode: "Real sources",
  };

  const key = cacheKey({
    route: "signals",
    topics: query.topics,
    sourceMix: query.sourceMix,
    timeWindow: query.timeWindow,
    limit: query.limit,
    mode: query.mode,
  });
  const cached = getCachedValue<unknown>(key);
  if (cached) {
    return NextResponse.json(cached);
  }

  const perSourceLimit = sourceLimit(query.limit);
  const sourceFetches: Array<Promise<SourceFetchResult>> = [];

  if (enabledSourceIds.has("src-fda")) {
    sourceFetches.push(fetchFdaItems(query.searchTerms, perSourceLimit));
  } else {
    sourceFetches.push(
      Promise.resolve({
        items: [],
        status: { source: "FDA", status: "skipped", count: 0 },
      }),
    );
  }

  if (enabledSourceIds.has("src-pubmed")) {
    sourceFetches.push(fetchPubMedItems(query.searchTerms, perSourceLimit));
  } else {
    sourceFetches.push(
      Promise.resolve({
        items: [],
        status: { source: "PubMed", status: "skipped", count: 0 },
      }),
    );
  }

  if (enabledSourceIds.has("src-ctgov")) {
    sourceFetches.push(
      fetchClinicalTrialItems(query.searchTerms, perSourceLimit),
    );
  } else {
    sourceFetches.push(
      Promise.resolve({
        items: [],
        status: {
          source: "ClinicalTrials.gov",
          status: "skipped",
          count: 0,
        },
      }),
    );
  }

  const enabledIndustrySourceIds = industrySourceIds.filter((sourceId) =>
    enabledSourceIds.has(sourceId),
  );
  if (query.sourceMix !== "Primary only" && enabledIndustrySourceIds.length > 0) {
    sourceFetches.push(
      fetchIndustryNewsItems(
        query.searchTerms,
        perSourceLimit,
        enabledIndustrySourceIds,
      ),
    );
  } else {
    sourceFetches.push(
      Promise.resolve({
        items: [],
        status: { source: "Industry News", status: "skipped", count: 0 },
      }),
    );
  }

  const results: SourceFetchResult[] = await Promise.all(sourceFetches);

  const rawItems = results.flatMap((result) => result.items);
  const realSignals = dedupeSignals(
    rawItems
    .map((item) => normalizeItemToSignal(item, query.topics))
      .filter((signal) => isInsideWindow(signal.date, query.timeWindow)),
  )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const signals = realSignals.slice(0, query.limit);
  const sourceStatuses = results.map((result) => result.status);
  const warnings = sourceStatuses
    .filter((status) => status.status === "error")
    .map((status) => `${status.source} unavailable: ${status.error}`);

  const responseBody = {
    signals,
    sourceStatuses,
    cacheStatus: "miss",
    mode: query.mode,
    warnings,
  };

  setCachedValue(key, { ...responseBody, cacheStatus: "hit" }, 60 * 1000);
  return NextResponse.json(responseBody);
}
