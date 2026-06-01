"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultWatchlist,
  generalBiotechTopics,
} from "@/src/data/defaultData";
import { explainSignalRanking, getVisibleSignals } from "@/src/lib/ranking";
import type {
  BriefingControls,
  BriefingSettings,
  SectionFilter,
  Signal,
  SourceTrailItem,
} from "@/src/types/biointel";
import { BriefingHeader } from "./BriefingHeader";
import { BriefingOverview } from "./BriefingOverview";
import { QuickControls } from "./QuickControls";
import { SignalCard } from "./SignalCard";
import { SignalDetailPanel } from "./SignalDetailPanel";
import { SourceDrilldown } from "./SourceDrilldown";
import { usePreferences } from "./PreferencesContext";

const sections: SectionFilter[] = [
  "Top Signals",
  "Clinical Trials",
  "Regulatory",
  "Publications",
  "Company Updates",
  "Deals / Financing",
  "Saved",
];
interface ApiSourceStatus {
  source: string;
  status: "ok" | "error" | "skipped";
  count: number;
  error?: string;
}

interface SignalsApiResponse {
  signals: Signal[];
  sourceStatuses: ApiSourceStatus[];
  cacheStatus?: "hit" | "miss" | "skipped";
  warnings: string[];
}

function controlsFromSettings(settings: BriefingSettings): BriefingControls {
  return {
    briefingLength: settings.defaultBriefingLength,
    sourceMix: settings.defaultSourceMix,
    analysisMode: settings.defaultAnalysisMode,
    timeWindow: settings.defaultTimeWindow,
  };
}

export function TodayPage() {
  const { settings } = usePreferences();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [sourceWarnings, setSourceWarnings] = useState<string[]>([]);
  const [sourceStatuses, setSourceStatuses] = useState<ApiSourceStatus[]>([]);
  const [controls, setControls] = useState<BriefingControls>(() =>
    controlsFromSettings(settings),
  );
  const [section, setSection] = useState<SectionFilter>("Top Signals");
  const [selectedId, setSelectedId] = useState("");
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [lessLikeThisIds, setLessLikeThisIds] = useState<string[]>([]);
  const [trackedTopics, setTrackedTopics] = useState<string[]>(
    defaultWatchlist.map((item) => item.name),
  );
  const [selectedSource, setSelectedSource] = useState<SourceTrailItem | null>(
    null,
  );
  const [notice, setNotice] = useState("Loading real source signals.");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      topics: [...generalBiotechTopics, ...trackedTopics].join(","),
      sourceMix: controls.sourceMix,
      timeWindow: controls.timeWindow,
      limit: String(controls.briefingLength),
    });

    setLoadingSignals(true);
    fetch(`/api/signals?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`/api/signals returned ${response.status}`);
        }
        return (await response.json()) as SignalsApiResponse;
      })
      .then((data) => {
        setSignals(data.signals);
        setSourceStatuses(data.sourceStatuses);
        setSourceWarnings(data.warnings);
        setSelectedId(data.signals[0]?.id ?? "");
        setNotice(
          data.cacheStatus === "hit"
            ? "Real sources loaded from the server cache."
            : "Real sources loaded from the server-side ingestion route.",
        );
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSignals([]);
        setSourceWarnings([
          error instanceof Error
            ? `Real sources unavailable: ${error.message}`
            : "Real sources unavailable.",
        ]);
        setSourceStatuses([]);
        setNotice("Real source fetch failed. No fallback dataset is applied.");
      })
      .finally(() => {
        setLoadingSignals(false);
      });

    return () => controller.abort();
  }, [
    controls.briefingLength,
    controls.sourceMix,
    controls.timeWindow,
    trackedTopics,
  ]);

  const eligibleSignals = useMemo(() => {
    return signals.filter((signal) => {
      if (
        !settings.showSpeculativeItems &&
        signal.evidenceStatus === "Speculative"
      )
        return false;
      if (
        settings.requirePrimaryConfirmation &&
        signal.sourceStatus === "Noisy / needs confirmation"
      )
        return false;
      return true;
    });
  }, [settings, signals]);

  const visibleSignals = useMemo(
    () =>
      getVisibleSignals(
        eligibleSignals,
        controls,
        section,
        hiddenIds,
        lessLikeThisIds,
      ),
    [eligibleSignals, controls, section, hiddenIds, lessLikeThisIds],
  );
  const selectedSignal =
    visibleSignals.find((signal) => signal.id === selectedId) ??
    visibleSignals[0] ??
    null;

  function toggleSave(id: string) {
    setSignals((current) =>
      current.map((signal) =>
        signal.id === id ? { ...signal, saved: !signal.saved } : signal,
      ),
    );
    setNotice("Saved state updated locally for this session.");
  }

  function trackTopic(signal: Signal) {
    const topic = signal.matchedWatchlistTopics[0] ?? signal.tags[0]?.label;
    if (!topic) return;
    setTrackedTopics((current) =>
      current.includes(topic) ? current : [...current, topic],
    );
    setNotice(`${topic} is now tracked locally.`);
  }

  function openSources(signal: Signal) {
    setSelectedId(signal.id);
    setSelectedSource(signal.sourceTrail[0] ?? null);
    setNotice(
      "Source drill-down opened. Use the source trail to inspect trust, role, and confirmation requirements.",
    );
  }

  return (
    <div className="space-y-5">
      <BriefingHeader
        visibleCount={visibleSignals.length}
        controls={controls}
      />
      <QuickControls controls={controls} setControls={setControls} />
      <section className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Real source ingestion
            </p>
            <p className="mt-1 text-sm text-slate-600">
              FDA, PubMed, ClinicalTrials.gov, and non-paywalled industry RSS
              are fetched through the server-side API route.
            </p>
          </div>
        </div>
        {(loadingSignals ||
          sourceWarnings.length > 0 ||
          sourceStatuses.length > 0) && (
          <div className="mt-3 space-y-2 text-sm">
            {loadingSignals && (
              <p className="font-semibold text-slate-600">
                Loading real source signals...
              </p>
            )}
            {sourceWarnings.map((warning) => (
              <p key={warning} className="font-semibold text-amber-700">
                {warning}
              </p>
            ))}
            {sourceStatuses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sourceStatuses.map((status) => (
                  <span
                    key={status.source}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      status.status === "error"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {status.source}: {status.status} ({status.count})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <BriefingOverview
        signals={visibleSignals}
        controls={controls}
        trackedTopics={trackedTopics}
      />
      <div className="flex gap-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2">
        {sections.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSection(item)}
            className={`focus-ring whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
              section === item
                ? "bg-slate-950 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          {notice}
        </div>
      )}
      <SourceDrilldown
        signal={selectedSignal}
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-4">
          {visibleSignals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No live signals match this view. Try Broad source mix, a longer
              time window, or fewer filters.
            </div>
          ) : (
            visibleSignals.map((signal) => {
              const ranking = explainSignalRanking(
                signal,
                controls,
                lessLikeThisIds,
              );
              const isSelected = selectedSignal?.id === signal.id;

              return (
                <div key={signal.id} className="space-y-4">
                  <SignalCard
                    signal={signal}
                    selected={isSelected}
                    ranking={ranking}
                    onSelect={() => setSelectedId(signal.id)}
                    onToggleSave={() => toggleSave(signal.id)}
                    onHide={() => {
                      setHiddenIds((ids) => [...ids, signal.id]);
                      setNotice("Signal hidden for this session.");
                    }}
                    onLessLikeThis={() => {
                      setLessLikeThisIds((ids) =>
                        ids.includes(signal.id) ? ids : [...ids, signal.id],
                      );
                      setNotice(
                        "This signal was lightly downranked for the current session.",
                      );
                    }}
                    onTrackTopic={() => trackTopic(signal)}
                    onOpenSources={() => openSources(signal)}
                  />
                  {isSelected && (
                    <div className="xl:hidden">
                      <SignalDetailPanel
                        signal={selectedSignal}
                        controls={controls}
                        lessLikeThisIds={lessLikeThisIds}
                        onInspectSource={setSelectedSource}
                        mobile
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Tracked locally this session: {trackedTopics.slice(0, 8).join(", ")}
            {trackedTopics.length > 8 ? "…" : ""}
          </div>
        </div>
        <div className="hidden xl:block">
          <SignalDetailPanel
            signal={selectedSignal}
            controls={controls}
            lessLikeThisIds={lessLikeThisIds}
            onInspectSource={setSelectedSource}
          />
        </div>
      </div>
    </div>
  );
}
