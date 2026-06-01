import type { SourceTrailItem } from "@/src/types/biointel";
import { Badge, toneForTrust } from "./Badge";

export function SourceTrail({
  items,
  compact = false,
  onInspectSource,
}: {
  items: SourceTrailItem[];
  compact?: boolean;
  onInspectSource?: (source: SourceTrailItem) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((source, index) => (
        <div
          key={`${source.sourceName}-${index}`}
          className="rounded-2xl border border-slate-200 bg-white p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{source.sourceName}</p>
            <Badge tone={toneForTrust(source.trustLevel)}>
              {source.trustLevel}
            </Badge>
            <Badge>{source.role}</Badge>
          </div>
          {!compact && (
            <p className="mt-2 text-sm text-slate-600">{source.note}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>{source.sourceType}</span>
            <span>•</span>
            <span>{source.status}</span>
            {source.requiresPrimaryConfirmation && (
              <span>• Requires primary confirmation</span>
            )}
          </div>
          {onInspectSource && (
            <button
              type="button"
              onClick={() => onInspectSource(source)}
              className="focus-ring mt-3 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-slate-950 hover:text-slate-950"
            >
              Inspect source
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
