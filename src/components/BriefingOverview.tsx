import type { BriefingControls, Signal } from "@/src/types/biointel";
import { Badge, toneForTrust } from "./Badge";

function topItems(items: string[], limit: number) {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([item]) => item);
}

function watchlistLimit(briefingLength: BriefingControls["briefingLength"]) {
  if (briefingLength === 5) return 3;
  if (briefingLength === 10) return 5;
  return 8;
}

export function BriefingOverview({
  signals,
  controls,
  trackedTopics,
}: {
  signals: Signal[];
  controls: BriefingControls;
  trackedTopics: string[];
}) {
  const topEventTypes = topItems(
    signals.map((signal) => signal.eventType),
    3,
  );
  const topWatchlistTopics = topItems(
    signals.flatMap((signal) => signal.matchedWatchlistTopics),
    4,
  );
  const watchlistGroups = trackedTopics
    .map((topic) => ({
      topic,
      signals: signals.filter((signal) =>
        signal.matchedWatchlistTopics.includes(topic),
      ),
    }))
    .filter((group) => group.signals.length > 0)
    .slice(0, watchlistLimit(controls.briefingLength));

  if (signals.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-slate-600">
        No briefing overview is available for the current knobs.
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Briefing overview
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Today is centered on your watchlist
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Showing {signals.length} source-backed signals for{" "}
            {controls.timeWindow.toLowerCase()} using {controls.sourceMix}{" "}
            sources and {controls.analysisMode} analysis. The feed is capped by
            your briefing length so broad coverage does not flood the page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {topEventTypes.map((eventType) => (
            <Badge key={eventType} tone="blue">
              {eventType}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-950">General news layer</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Main themes: {topWatchlistTopics.join(", ")}. Top ranked signal:{" "}
            {signals[0].headline}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-slate-950">Feed discipline</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Watchlist sections show up to two signals each, and only the
            strongest {watchlistGroups.length} matching topics are summarized
            before the detailed feed.
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {watchlistGroups.map((group) => (
          <article
            key={group.topic}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-slate-950">{group.topic}</h3>
              <Badge>{group.signals.length} signals</Badge>
            </div>
            <div className="mt-3 space-y-3">
              {group.signals.slice(0, 2).map((signal) => (
                <div key={signal.id}>
                  <p className="text-sm font-semibold leading-5 text-slate-900">
                    {signal.headline}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone={toneForTrust(signal.evidenceStatus)}>
                      {signal.evidenceStatus}
                    </Badge>
                    <Badge tone={toneForTrust(signal.sourceStatus)}>
                      {signal.sourceStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
