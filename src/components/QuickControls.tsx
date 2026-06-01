import type {
  AnalysisMode,
  BriefingControls,
  BriefingLength,
  SourceMix,
  TimeWindow,
} from "@/src/types/biointel";

const lengths: BriefingLength[] = [5, 10, 20];
const mixes: SourceMix[] = ["Primary only", "Balanced", "Broad"];
const modes: AnalysisMode[] = [
  "Scientist",
  "Consultant",
  "Investor",
  "Beginner",
];
const windows: TimeWindow[] = ["Last 24h", "3 days", "7 days"];

function ButtonGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`focus-ring rounded-full border px-3 py-1.5 text-sm font-semibold ${option === value ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuickControls({
  controls,
  setControls,
}: {
  controls: BriefingControls;
  setControls: (controls: BriefingControls) => void;
}) {
  return (
    <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
      <ButtonGroup
        label="Briefing length"
        options={lengths}
        value={controls.briefingLength}
        onChange={(briefingLength) =>
          setControls({ ...controls, briefingLength })
        }
      />
      <ButtonGroup
        label="Source mix"
        options={mixes}
        value={controls.sourceMix}
        onChange={(sourceMix) => setControls({ ...controls, sourceMix })}
      />
      <ButtonGroup
        label="Analysis mode"
        options={modes}
        value={controls.analysisMode}
        onChange={(analysisMode) => setControls({ ...controls, analysisMode })}
      />
      <ButtonGroup
        label="Time window"
        options={windows}
        value={controls.timeWindow}
        onChange={(timeWindow) => setControls({ ...controls, timeWindow })}
      />
    </section>
  );
}
