export function ArchiveList() {
  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Memory
        </p>
        <h1 className="mt-2 text-3xl font-black">Archive</h1>
        <p className="mt-2 text-slate-600">
          Full briefing archives are not active yet. Your local preferences,
          watchlist, source toggles, saved signals, hidden signals, and
          downranking choices are saved in this browser.
        </p>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">No stored briefings yet</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The current site has no database or authentication, so saved state is
          local to this browser. Live source results are still fetched on demand
          through the server-side ingestion route.
        </p>
      </section>
    </div>
  );
}
