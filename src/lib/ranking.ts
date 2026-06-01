import type {
  BriefingControls,
  SectionFilter,
  Signal,
  SourceMix,
} from "@/src/types/biointel";

const eventWeights: Record<string, number> = {
  Regulatory: 14,
  "Clinical Trial": 13,
  Publication: 9,
  "Deal / Financing": 8,
  "Company Update": 7,
  "Safety Signal": 6,
  "AI Drug Discovery": 5,
};
const importanceWeights: Record<string, number> = {
  Critical: 20,
  High: 15,
  Medium: 9,
  Low: 3,
};
const confidenceWeights: Record<string, number> = {
  "High confidence": 10,
  "Medium confidence": 6,
  "Low confidence": 1,
};
const sourceWeights: Record<string, number> = {
  "Primary confirmed": 14,
  "Primary plus coverage": 10,
  "Secondary only": 4,
  "Noisy / needs confirmation": -4,
};

export interface RankingExplanation {
  totalScore: number;
  reasons: string[];
}

export function dateWithinWindow(
  date: string,
  window: BriefingControls["timeWindow"],
) {
  const days = window === "Last 24h" ? 1 : window === "3 days" ? 3 : 7;
  const now = new Date("2026-06-01T12:00:00Z").getTime();
  const then = new Date(`${date}T12:00:00Z`).getTime();
  return now - then <= days * 24 * 60 * 60 * 1000;
}

export function sourceMixAllows(signal: Signal, sourceMix: SourceMix) {
  if (sourceMix === "Broad") return true;
  if (sourceMix === "Balanced")
    return signal.sourceStatus !== "Noisy / needs confirmation";

  return (
    signal.sourceTrail.some(
      (source) =>
        source.sourceType === "Primary source" ||
        source.sourceType === "Scientific literature" ||
        source.sourceType === "Financial filing",
    ) && signal.sourceStatus !== "Secondary only"
  );
}

export function sectionAllows(signal: Signal, section: SectionFilter) {
  if (section === "Top Signals") return true;
  if (section === "Saved") return signal.saved;
  return signal.section === section;
}

export function explainSignalRanking(
  signal: Signal,
  controls: BriefingControls,
  lessLikeThisIds: string[],
): RankingExplanation {
  const reasons: string[] = [];
  const watchlistBoost = signal.matchedWatchlistTopics.length * 4;
  const scientistBoost =
    controls.analysisMode === "Scientist" &&
    ["Clinical Trial", "Publication"].includes(signal.eventType)
      ? 4
      : 0;
  const investorBoost =
    controls.analysisMode === "Investor" &&
    ["Deal / Financing", "Company Update", "Regulatory"].includes(
      signal.eventType,
    )
      ? 4
      : 0;
  const consultantBoost =
    controls.analysisMode === "Consultant" &&
    ["Regulatory", "Company Update"].includes(signal.eventType)
      ? 3
      : 0;
  const beginnerBoost =
    controls.analysisMode === "Beginner" &&
    signal.confidence === "High confidence"
      ? 2
      : 0;
  const lessPenalty = lessLikeThisIds.includes(signal.id) ? -18 : 0;
  const broadPenalty =
    controls.sourceMix === "Broad" &&
    signal.sourceStatus === "Noisy / needs confirmation"
      ? -3
      : 0;

  reasons.push(
    `${signal.importance} importance adds ${importanceWeights[signal.importance] ?? 0} points.`,
  );
  reasons.push(
    `${signal.eventType} event type adds ${eventWeights[signal.eventType] ?? 0} points.`,
  );
  reasons.push(
    `${signal.sourceStatus} source status adds ${sourceWeights[signal.sourceStatus] ?? 0} points.`,
  );
  reasons.push(
    `${signal.confidence} adds ${confidenceWeights[signal.confidence] ?? 0} points.`,
  );

  if (watchlistBoost > 0) {
    reasons.push(
      `${signal.matchedWatchlistTopics.length} matched watchlist topics add ${watchlistBoost} points.`,
    );
  }
  if (scientistBoost)
    reasons.push("Scientist mode boosts clinical and publication evidence.");
  if (investorBoost)
    reasons.push(
      "Investor mode boosts deal, company, and regulatory catalysts.",
    );
  if (consultantBoost)
    reasons.push(
      "Consultant mode boosts market-shaping regulatory and company updates.",
    );
  if (beginnerBoost)
    reasons.push("Beginner mode slightly boosts high-confidence signals.");
  if (lessPenalty)
    reasons.push("“Less like this” applies a local downranking penalty.");
  if (broadPenalty)
    reasons.push(
      "Broad source mix includes noisy items but keeps them below confirmed evidence.",
    );

  const totalScore =
    (eventWeights[signal.eventType] ?? 0) +
    (importanceWeights[signal.importance] ?? 0) +
    (confidenceWeights[signal.confidence] ?? 0) +
    (sourceWeights[signal.sourceStatus] ?? 0) +
    watchlistBoost +
    scientistBoost +
    investorBoost +
    consultantBoost +
    beginnerBoost +
    lessPenalty +
    broadPenalty;

  return { totalScore, reasons };
}

export function scoreSignal(
  signal: Signal,
  controls: BriefingControls,
  lessLikeThisIds: string[],
) {
  return explainSignalRanking(signal, controls, lessLikeThisIds).totalScore;
}

export function getVisibleSignals(
  signals: Signal[],
  controls: BriefingControls,
  section: SectionFilter,
  hiddenIds: string[],
  lessLikeThisIds: string[],
) {
  return signals
    .filter((signal) => !hiddenIds.includes(signal.id))
    .filter((signal) => dateWithinWindow(signal.date, controls.timeWindow))
    .filter((signal) => sourceMixAllows(signal, controls.sourceMix))
    .filter((signal) => sectionAllows(signal, section))
    .sort(
      (a, b) =>
        scoreSignal(b, controls, lessLikeThisIds) -
        scoreSignal(a, controls, lessLikeThisIds),
    )
    .slice(0, controls.briefingLength);
}
