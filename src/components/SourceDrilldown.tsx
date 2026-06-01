import type { Signal, SourceTrailItem } from "@/src/types/biointel";
import { Badge, toneForTrust } from "./Badge";

type SourceDrilldownProps = {
  signal: Signal | null;
  source: SourceTrailItem | null;
  onClose: () => void;
};

export function SourceDrilldown({
  signal,
  source,
  onClose,
}: SourceDrilldownProps) {
  if (!signal || !source) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Source drill-down
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950">
            {source.sourceName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Linked to: {signal.headline}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:border-slate-900 hover:text-slate-950"
        >
          Close
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">
            Trust cue
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={toneForTrust(source.trustLevel)}>
              {source.trustLevel} trust
            </Badge>
            <Badge tone={toneForTrust(source.status)}>{source.status}</Badge>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">
            Role in evidence trail
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{source.role}</Badge>
            <Badge>{source.sourceType}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
        <p className="font-bold text-slate-950">Analyst note</p>
        <p className="mt-1">{source.note}</p>
        <p className="mt-3">
          {source.requiresPrimaryConfirmation
            ? "This source is useful for context or market reaction, but BioIntel should require a primary confirmation before treating the claim as established."
            : "This source can support the main claim directly because it is primary or high-trust evidence."}
        </p>
      </div>
    </section>
  );
}
