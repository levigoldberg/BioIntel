import type { Signal } from "@/src/types/biointel";
import type { RankingExplanation } from "@/src/lib/ranking";
import { Badge, toneForTrust } from "./Badge";

export function SignalCard({
  signal,
  selected,
  ranking,
  onSelect,
  onToggleSave,
  onHide,
  onLessLikeThis,
  onTrackTopic,
  onOpenSources,
}: {
  signal: Signal;
  selected: boolean;
  ranking: RankingExplanation;
  onSelect: () => void;
  onToggleSave: () => void;
  onHide: () => void;
  onLessLikeThis: () => void;
  onTrackTopic: () => void;
  onOpenSources: () => void;
}) {
  const firstSource = signal.sourceTrail[0];

  return (
    <article
      className={`rounded-3xl border bg-white p-4 shadow-sm transition ${
        selected
          ? "border-slate-950 ring-2 ring-slate-950/10"
          : "border-slate-200 hover:border-slate-400"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="focus-ring block w-full rounded-2xl text-left"
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{signal.eventType}</Badge>
          <Badge
            tone={
              signal.importance === "Critical"
                ? "red"
                : signal.importance === "High"
                  ? "amber"
                  : "slate"
            }
          >
            {signal.importance}
          </Badge>
          <Badge tone="purple">{signal.relevance}</Badge>
          <Badge tone={toneForTrust(signal.confidence)}>
            {signal.confidence}
          </Badge>
          <Badge tone={toneForTrust(signal.sourceStatus)}>
            {signal.sourceStatus}
          </Badge>
        </div>
        <h2 className="mt-3 text-xl font-black leading-tight text-slate-950">
          {signal.headline}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {signal.summary}
        </p>
        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <span className="font-bold text-slate-950">Why it matters: </span>
          {signal.whyItMatters}
        </div>
        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          <span className="font-bold">Why ranked here: </span>
          {ranking.reasons.slice(0, 2).join(" ")} Score {ranking.totalScore}.
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {signal.tags.map((tag) => (
            <Badge key={`${signal.id}-${tag.label}`}>{tag.label}</Badge>
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            Matched watchlist:{" "}
          </span>
          {signal.matchedWatchlistTopics.join(", ")}
        </div>
        <div className="mt-2 text-sm text-slate-500">
          <span className="font-semibold">Source trail preview:</span>{" "}
          {firstSource.sourceName} · {firstSource.sourceType} ·{" "}
          {firstSource.trustLevel}
        </div>
      </button>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onToggleSave}
          className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:border-slate-950"
        >
          {signal.saved ? "Unsave" : "Save"}
        </button>
        <button
          type="button"
          onClick={onHide}
          className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:border-slate-950"
        >
          Hide
        </button>
        <button
          type="button"
          onClick={onLessLikeThis}
          className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:border-slate-950"
        >
          Less like this
        </button>
        <button
          type="button"
          onClick={onTrackTopic}
          className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:border-slate-950"
        >
          Track related topic
        </button>
        <button
          type="button"
          onClick={onOpenSources}
          className="focus-ring rounded-full border border-slate-950 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Open sources
        </button>
      </div>
    </article>
  );
}
