import type {
  BriefingControls,
  Signal,
  SourceTrailItem,
} from "@/src/types/biointel";
import { explainSignalRanking } from "@/src/lib/ranking";
import { Badge, toneForTrust } from "./Badge";
import { SourceTrail } from "./SourceTrail";

export function SignalDetailPanel({
  signal,
  controls,
  lessLikeThisIds,
  onInspectSource,
  mobile = false,
}: {
  signal: Signal | null;
  controls: BriefingControls;
  lessLikeThisIds: string[];
  onInspectSource: (source: SourceTrailItem) => void;
  mobile?: boolean;
}) {
  if (!signal) {
    return (
      <aside className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
        Select a signal to inspect evidence, source roles, and suggested next
        actions.
      </aside>
    );
  }

  const explanation = explainSignalRanking(signal, controls, lessLikeThisIds);

  return (
    <aside
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-soft ${mobile ? "" : "lg:sticky lg:top-8"}`}
    >
      <div className="flex flex-wrap gap-2">
        <Badge tone="blue">{signal.eventType}</Badge>
        <Badge tone={toneForTrust(signal.evidenceStatus)}>
          {signal.evidenceStatus}
        </Badge>
        <Badge tone={toneForTrust(signal.sourceStatus)}>
          {signal.sourceStatus}
        </Badge>
      </div>
      <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950">
        {signal.headline}
      </h2>
      <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
        <section>
          <h3 className="font-bold text-slate-950">Why ranked here</h3>
          <p className="mt-1">Mock ranking score: {explanation.totalScore}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {explanation.reasons.slice(0, 6).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="font-bold text-slate-950">Why you are seeing this</h3>
          <p>{signal.whyYouAreSeeingThis}</p>
        </section>
        <section>
          <h3 className="font-bold text-slate-950">Why it matters</h3>
          <p>{signal.whyItMatters}</p>
        </section>
        <section>
          <h3 className="font-bold text-slate-950">What changed</h3>
          <p>{signal.whatChanged}</p>
        </section>
        <section>
          <h3 className="mb-2 font-bold text-slate-950">Source trail</h3>
          <SourceTrail
            items={signal.sourceTrail}
            onInspectSource={onInspectSource}
          />
        </section>
        <section>
          <h3 className="font-bold text-slate-950">Related companies</h3>
          <p>{signal.relatedCompanies.join(", ")}</p>
        </section>
        <section>
          <h3 className="font-bold text-slate-950">Related diseases</h3>
          <p>{signal.relatedDiseases.join(", ")}</p>
        </section>
        <section>
          <h3 className="font-bold text-slate-950">Related mechanisms</h3>
          <p>{signal.relatedMechanisms.join(", ")}</p>
        </section>
        <section>
          <h3 className="font-bold text-slate-950">Suggested next actions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {signal.suggestedNextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <h3 className="font-bold text-slate-950">Evidence status</h3>
          <p>
            {signal.evidenceStatus}. Treat sponsor-selected or noisy items as
            watch-next prompts, not conclusions.
          </p>
        </section>
      </div>
    </aside>
  );
}
