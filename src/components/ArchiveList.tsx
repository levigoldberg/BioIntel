"use client";

import { useMemo, useState } from "react";
import { mockArchive, mockSignals } from "@/src/data/mockData";
import { Badge } from "./Badge";

export function ArchiveList() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const options = [
    "All",
    "Sjögren’s disease",
    "IgA nephropathy",
    "Obesity",
    "Alzheimer’s disease",
    "Regulatory",
    "Clinical Trial",
    "APRIL inhibition",
  ];
  const filtered = useMemo(
    () =>
      mockArchive.filter((item) => {
        const text =
          `${item.title} ${item.summary} ${item.diseases.join(" ")} ${item.companies.join(" ")} ${item.mechanisms.join(" ")} ${item.eventTypes.join(" ")}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesFilter =
          filter === "All" || text.includes(filter.toLowerCase());
        return matchesQuery && matchesFilter;
      }),
    [query, filter],
  );
  const savedSignals = mockSignals.filter((signal) => signal.saved);
  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Memory
        </p>
        <h1 className="mt-2 text-3xl font-black">Archive</h1>
        <p className="mt-2 text-slate-600">
          Search past briefings and saved signals by disease, company,
          mechanism, event type, or date.
        </p>
      </header>
      <section className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_260px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search archive"
          className="rounded-2xl border border-slate-200 px-4 py-3"
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  {item.date} · {item.generatedAt}
                </p>
                <h2 className="mt-1 text-xl font-black">{item.title}</h2>
              </div>
              <Badge>{item.topSignalIds.length} top signals</Badge>
            </div>
            <p className="mt-3 text-slate-600">{item.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ...item.diseases,
                ...item.companies,
                ...item.mechanisms,
                ...item.eventTypes,
              ]
                .slice(0, 8)
                .map((label) => (
                  <Badge key={`${item.id}-${label}`}>{label}</Badge>
                ))}
            </div>
          </article>
        ))}
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">Saved signals</h2>
        <div className="mt-4 space-y-3">
          {savedSignals.map((signal) => (
            <article
              key={signal.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap gap-2">
                <Badge>{signal.eventType}</Badge>
                <Badge>{signal.date}</Badge>
              </div>
              <h3 className="mt-2 font-black">{signal.headline}</h3>
              <p className="mt-1 text-sm text-slate-600">{signal.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
