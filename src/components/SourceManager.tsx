"use client";

import { useState } from "react";
import { defaultSources } from "@/src/data/defaultData";
import type { SourceDefinition, SourceType } from "@/src/types/biointel";
import { Badge, toneForTrust } from "./Badge";

const groups: SourceType[] = [
  "Primary source",
  "Industry news",
  "Scientific literature",
  "Financial filing",
  "Company source",
  "Noisy / social source",
];
const labels: Record<SourceType, string> = {
  "Primary source": "Primary sources",
  "Industry news": "Industry news",
  "Scientific literature": "Scientific literature",
  "Financial filing": "Financial filings",
  "Company source": "Company sources",
  "Noisy / social source": "Noisy/social sources",
};
const connectedSourceIds = new Set([
  "src-fda",
  "src-ctgov",
  "src-pubmed",
  "src-fierce",
  "src-fiercepharma",
  "src-biopharmadive",
]);

function connectionStatusFor(source: SourceDefinition) {
  if (!source.enabled) return "Disabled";
  return source.connectionStatus ?? (connectedSourceIds.has(source.id) ? "Connected" : "Planned");
}

export function SourceManager() {
  const [sources, setSources] = useState<SourceDefinition[]>(defaultSources);
  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Evidence controls
        </p>
        <h1 className="mt-2 text-3xl font-black">Sources</h1>
        <p className="mt-2 text-slate-600">
          Source quality, bias risk, and confirmation requirements shape how
          live signals are ranked and explained.
        </p>
      </header>
      {groups.map((group) => (
        <section
          key={group}
          className="rounded-3xl border border-slate-200 bg-white p-5"
        >
          <h2 className="text-xl font-black">{labels[group]}</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {sources
              .filter((source) => source.category === group)
              .map((source) => {
                const connectionStatus = connectionStatusFor(source);

                return (
                  <article
                    key={source.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black">{source.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {source.usefulFor}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSources((current) =>
                            current.map((item) =>
                              item.id === source.id
                                ? { ...item, enabled: !item.enabled }
                                : item,
                            ),
                          )
                        }
                        className={`rounded-full px-3 py-1.5 text-sm font-bold ${source.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}
                      >
                        {source.enabled ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge
                        tone={
                          connectionStatus === "Connected"
                            ? "green"
                            : connectionStatus === "Error"
                              ? "red"
                              : connectionStatus === "Disabled"
                                ? "slate"
                                : "amber"
                        }
                      >
                        {connectionStatus}
                      </Badge>
                      <Badge tone={toneForTrust(source.trustLevel)}>
                        {source.trustLevel} trust
                      </Badge>
                      <Badge>{source.priority} priority</Badge>
                      <Badge
                        tone={
                          source.biasRisk === "High"
                            ? "red"
                            : source.biasRisk === "Medium"
                              ? "amber"
                              : "green"
                        }
                      >
                        {source.biasRisk} bias risk
                      </Badge>
                      {source.requiresPrimaryConfirmation && (
                        <Badge tone="amber">Requires primary confirmation</Badge>
                      )}
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
