import type { Signal, SourceTrailItem } from "@/src/types/biointel";

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleKey(signal: Signal) {
  return normalizeTitle(signal.headline).split(" ").slice(0, 9).join(" ");
}

function sourceKey(source: SourceTrailItem) {
  return `${source.sourceName}-${source.sourceUrl ?? source.note}`;
}

function uniqueSources(sources: SourceTrailItem[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = sourceKey(source);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function score(signal: Signal) {
  let value = 0;
  if (signal.sourceStatus === "Primary confirmed") value += 3;
  if (signal.evidenceStatus === "Regulatory source") value += 3;
  if (signal.evidenceStatus === "Clinical trial registry") value += 3;
  if (signal.evidenceStatus === "Scientific literature") value += 2;
  value += signal.sourceTrail.length;
  value += signal.matchedWatchlistTopics.filter(
    (topic) => topic !== "General biotech",
  ).length;
  return value;
}

function mergeSignals(existing: Signal, next: Signal) {
  const keeper = score(next) > score(existing) ? next : existing;
  const other = keeper === next ? existing : next;
  const sourceTrail = uniqueSources([...keeper.sourceTrail, ...other.sourceTrail]);
  const matchedWatchlistTopics = Array.from(
    new Set([...keeper.matchedWatchlistTopics, ...other.matchedWatchlistTopics]),
  );
  const tags = Array.from(
    new Map(
      [...keeper.tags, ...other.tags].map((tag) => [`${tag.type}-${tag.label}`, tag]),
    ).values(),
  );

  return {
    ...keeper,
    sourceTrail,
    matchedWatchlistTopics,
    tags,
    sourceStatus:
      sourceTrail.length > keeper.sourceTrail.length
        ? "Primary plus coverage"
        : keeper.sourceStatus,
    summary:
      sourceTrail.length > keeper.sourceTrail.length
        ? `${keeper.summary} Additional source coverage was deduplicated into this signal.`
        : keeper.summary,
  };
}

export function dedupeSignals(signals: Signal[]) {
  const byKey = new Map<string, Signal>();

  signals.forEach((signal) => {
    const externalKey = signal.externalUrl
      ? `url:${signal.externalUrl}`
      : `title:${titleKey(signal)}`;
    const key =
      signal.eventType === "Clinical Trial"
        ? `trial:${signal.sourceTrail[0]?.sourceUrl ?? signal.id}`
        : externalKey;
    const existing = byKey.get(key);
    byKey.set(key, existing ? mergeSignals(existing, signal) : signal);
  });

  return Array.from(byKey.values());
}
