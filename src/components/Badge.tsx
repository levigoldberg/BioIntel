import type { ReactNode } from "react";

type Tone = "blue" | "green" | "amber" | "red" | "slate" | "purple";

const tones: Record<Tone, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-rose-200 bg-rose-50 text-rose-800",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  purple: "border-violet-200 bg-violet-50 text-violet-800",
};

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function toneForTrust(label: string): Tone {
  if (
    label.includes("Very high") ||
    label.includes("Primary confirmed") ||
    label === "Confirmed" ||
    label === "Regulatory source" ||
    label === "Scientific literature" ||
    label === "Clinical trial registry" ||
    label === "Industry news"
  )
    return "green";
  if (
    label.includes("Medium") ||
    label.includes("Emerging") ||
    label.includes("Primary plus")
  )
    return "amber";
  if (
    label.includes("Low") ||
    label.includes("Noisy") ||
    label.includes("Speculative") ||
    label.includes("Conflicting")
  )
    return "red";
  return "slate";
}
