"use client";

import { useState } from "react";
import { mockWatchlist } from "@/src/data/mockData";
import type { WatchlistItem, WatchlistType } from "@/src/types/biointel";
import { Badge } from "./Badge";

const groups: WatchlistType[] = [
  "Disease",
  "Company",
  "Drug / asset",
  "Mechanism",
  "Keyword / theme",
];

export function WatchlistManager() {
  const [items, setItems] = useState<WatchlistItem[]>(mockWatchlist);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  function toggle(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  }
  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }
  function startEdit(item: WatchlistItem) {
    setEditingId(item.id);
    setDraftName(item.name);
  }
  function saveEdit(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, name: draftName || item.name } : item,
      ),
    );
    setEditingId(null);
  }

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Personalization
        </p>
        <h1 className="mt-2 text-3xl font-black">Watchlist</h1>
        <p className="mt-2 text-slate-600">
          Pause, remove, or mock-edit tracked diseases, companies, assets,
          mechanisms, and themes.
        </p>
      </header>
      {groups.map((group) => (
        <section
          key={group}
          className="rounded-3xl border border-slate-200 bg-white p-5"
        >
          <h2 className="text-xl font-black">{group}s</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {items
              .filter((item) => item.type === group)
              .map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {editingId === item.id ? (
                        <input
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                          value={draftName}
                          onChange={(event) => setDraftName(event.target.value)}
                        />
                      ) : (
                        <h3 className="font-black">{item.name}</h3>
                      )}
                      <p className="mt-1 text-sm text-slate-600">
                        {item.rationale}
                      </p>
                    </div>
                    <Badge tone={item.enabled ? "green" : "slate"}>
                      {item.enabled ? "Enabled" : "Paused"}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{item.priority} priority</Badge>
                    <Badge>{item.recentSignalCount} recent signals</Badge>
                    {item.synonyms.slice(0, 3).map((synonym) => (
                      <Badge key={synonym}>{synonym}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => toggle(item.id)}
                      className="rounded-full border px-3 py-1.5 text-sm font-semibold"
                    >
                      {item.enabled ? "Pause" : "Enable"}
                    </button>
                    {editingId === item.id ? (
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="rounded-full border border-slate-950 bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white"
                      >
                        Save edit
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-full border px-3 py-1.5 text-sm font-semibold"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => remove(item.id)}
                      className="rounded-full border px-3 py-1.5 text-sm font-semibold text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
