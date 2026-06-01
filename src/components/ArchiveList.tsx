export function ArchiveList() {
  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Memory
        </p>
        <h1 className="mt-2 text-3xl font-black">Archive</h1>
        <p className="mt-2 text-slate-600">
          Archive storage is not active yet. Live source results are fetched on
          demand and are not persisted between sessions.
        </p>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">No stored briefings yet</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          The current site has no database, authentication, or persistent saved
          signals. Adding persistence should be a separate backend build so the
          ingestion layer remains clear and testable.
        </p>
      </section>
    </div>
  );
}
