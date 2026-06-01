import type { BriefingControls } from "@/src/types/biointel";

export function BriefingHeader({
  visibleCount,
  controls,
}: {
  visibleCount: number;
  controls: BriefingControls;
}) {
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date("2026-06-01T12:00:00Z"));
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Morning intelligence
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            BioIntel Briefing
          </h1>
          <p className="mt-3 text-slate-600">
            {date} • Generated 06:42 AM ET • {visibleCount} visible signals
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[440px]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Source mix
            </p>
            <p className="mt-1 text-lg font-bold">{controls.sourceMix}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Analysis mode
            </p>
            <p className="mt-1 text-lg font-bold">{controls.analysisMode}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
