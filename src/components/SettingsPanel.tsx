"use client";

import type {
  AnalysisMode,
  BriefingLength,
  DetailDepth,
  EventType,
  EvidenceStatus,
  SourceMix,
  TimeWindow,
  ToneDepth,
} from "@/src/types/biointel";
import { usePreferences } from "./PreferencesContext";

function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) =>
          onChange(
            (typeof value === "number"
              ? Number(event.target.value)
              : event.target.value) as T,
          )
        }
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-3">
      <span className="font-semibold text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}

const events: EventType[] = [
  "Clinical Trial",
  "Regulatory",
  "Publication",
  "Company Update",
  "Deal / Financing",
  "Safety Signal",
  "AI Drug Discovery",
];
const evidence: EvidenceStatus[] = [
  "Confirmed",
  "Emerging",
  "Speculative",
  "Conflicting",
];

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = usePreferences();

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Shared local preferences
        </p>
        <h1 className="mt-2 text-3xl font-black">Settings</h1>
        <p className="mt-2 text-slate-600">
          These knobs update a lightweight client-side preferences context.
          Today initializes from these defaults during this app session.
        </p>
        <button
          type="button"
          onClick={resetSettings}
          className="focus-ring mt-4 rounded-full border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-bold text-white"
        >
          Reset to Build 1 defaults
        </button>
      </header>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <Select
          label="Default briefing length"
          value={settings.defaultBriefingLength}
          options={[5, 10, 20] as BriefingLength[]}
          onChange={(defaultBriefingLength) =>
            updateSettings({ ...settings, defaultBriefingLength })
          }
        />
        <Select
          label="Default source mix"
          value={settings.defaultSourceMix}
          options={["Primary only", "Balanced", "Broad"] as SourceMix[]}
          onChange={(defaultSourceMix) =>
            updateSettings({ ...settings, defaultSourceMix })
          }
        />
        <Select
          label="Default analysis mode"
          value={settings.defaultAnalysisMode}
          options={
            [
              "Scientist",
              "Consultant",
              "Investor",
              "Beginner",
            ] as AnalysisMode[]
          }
          onChange={(defaultAnalysisMode) =>
            updateSettings({ ...settings, defaultAnalysisMode })
          }
        />
        <Select
          label="Default time window"
          value={settings.defaultTimeWindow}
          options={["Last 24h", "3 days", "7 days"] as TimeWindow[]}
          onChange={(defaultTimeWindow) =>
            updateSettings({ ...settings, defaultTimeWindow })
          }
        />
        <Select
          label="Tone / depth"
          value={settings.toneDepth}
          options={["Concise", "Balanced", "Deep analyst"] as ToneDepth[]}
          onChange={(toneDepth) => updateSettings({ ...settings, toneDepth })}
        />
        <Select
          label="Default detail depth"
          value={settings.detailDepth}
          options={
            ["Quick skim", "Standard", "Detailed analyst"] as DetailDepth[]
          }
          onChange={(detailDepth) =>
            updateSettings({ ...settings, detailDepth })
          }
        />
      </section>

      <section className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <Toggle
          label="Show low-confidence items"
          checked={settings.showLowConfidenceItems}
          onChange={(showLowConfidenceItems) =>
            updateSettings({ ...settings, showLowConfidenceItems })
          }
        />
        <Toggle
          label="Show speculative items"
          checked={settings.showSpeculativeItems}
          onChange={(showSpeculativeItems) =>
            updateSettings({ ...settings, showSpeculativeItems })
          }
        />
        <Toggle
          label="Show duplicate coverage"
          checked={settings.showDuplicateCoverage}
          onChange={(showDuplicateCoverage) =>
            updateSettings({ ...settings, showDuplicateCoverage })
          }
        />
        <Toggle
          label="Include why it matters"
          checked={settings.includeWhyItMatters}
          onChange={(includeWhyItMatters) =>
            updateSettings({ ...settings, includeWhyItMatters })
          }
        />
        <Toggle
          label="Include watch next"
          checked={settings.includeWatchNext}
          onChange={(includeWatchNext) =>
            updateSettings({ ...settings, includeWatchNext })
          }
        />
        <Toggle
          label="Require primary confirmation for major claims"
          checked={settings.requirePrimaryConfirmation}
          onChange={(requirePrimaryConfirmation) =>
            updateSettings({ ...settings, requirePrimaryConfirmation })
          }
        />
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <div>
          <h2 className="font-black">Event priorities</h2>
          <div className="mt-3 space-y-2">
            {events.map((event) => (
              <Toggle
                key={event}
                label={event}
                checked={settings.priorityEvents.includes(event)}
                onChange={(checked) =>
                  updateSettings({
                    ...settings,
                    priorityEvents: checked
                      ? [...settings.priorityEvents, event]
                      : settings.priorityEvents.filter(
                          (item) => item !== event,
                        ),
                  })
                }
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-black">Evidence preferences</h2>
          <div className="mt-3 space-y-2">
            {evidence.map((status) => (
              <Toggle
                key={status}
                label={status}
                checked={settings.evidencePreferences.includes(status)}
                onChange={(checked) =>
                  updateSettings({
                    ...settings,
                    evidencePreferences: checked
                      ? [...settings.evidencePreferences, status]
                      : settings.evidencePreferences.filter(
                          (item) => item !== status,
                        ),
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
