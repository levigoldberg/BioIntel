import type { RawSourceItem, SourceFetchResult } from "./types";
import { cacheKey, getCachedValue, setCachedValue } from "./cache";

interface ClinicalTrialStudy {
  protocolSection?: {
    identificationModule?: {
      nctId?: string;
      briefTitle?: string;
    };
    statusModule?: {
      overallStatus?: string;
      lastUpdatePostDateStruct?: { date?: string };
    };
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name?: string };
    };
    conditionsModule?: {
      conditions?: string[];
    };
    designModule?: {
      phases?: string[];
    };
    armsInterventionsModule?: {
      interventions?: Array<{ name?: string }>;
    };
  };
}

interface ClinicalTrialsResponse {
  studies?: ClinicalTrialStudy[];
}

interface TrialSnapshot {
  status: string;
  phase: string;
  sponsor: string;
  conditions: string;
  interventions: string;
  lastUpdate: string;
}

const trialSnapshots = new Map<string, TrialSnapshot>();

function buildSearchTerm(topics: string[]) {
  const usefulTopics = topics.filter((topic) => topic.length > 2).slice(0, 8);
  return usefulTopics.length > 0 ? usefulTopics.join(" OR ") : "biotechnology";
}

function parseDate(value: string | undefined) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function changeNoteFor(nctId: string, snapshot: TrialSnapshot) {
  const previous = trialSnapshots.get(nctId);
  trialSnapshots.set(nctId, snapshot);

  if (!previous) {
    return {
      changeDetected: false,
      changeNote:
        "First in-memory snapshot captured for this session. No prior version is available yet.",
    };
  }

  const changes = Object.entries(snapshot)
    .filter(([key, value]) => previous[key as keyof TrialSnapshot] !== value)
    .map(
      ([key, value]) =>
        `${key} changed from "${previous[key as keyof TrialSnapshot]}" to "${value}"`,
    );

  if (changes.length === 0) {
    return {
      changeDetected: false,
      changeNote:
        "No change detected versus the prior in-memory ClinicalTrials.gov snapshot.",
    };
  }

  return {
    changeDetected: true,
    changeNote: `Detected in-memory ClinicalTrials.gov metadata change: ${changes.join("; ")}.`,
  };
}

export async function fetchClinicalTrialItems(
  searchTerms: string[],
  limit: number,
): Promise<SourceFetchResult> {
  const key = cacheKey({ source: "clinical-trials", searchTerms, limit });
  const cached = getCachedValue<SourceFetchResult>(key);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      "query.term": buildSearchTerm(searchTerms),
      pageSize: String(Math.min(limit, 10)),
    });
    const response = await fetch(
      `https://clinicaltrials.gov/api/v2/studies?${params}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(`ClinicalTrials.gov returned ${response.status}`);
    }

    const data = (await response.json()) as ClinicalTrialsResponse;
    const items: RawSourceItem[] = (data.studies ?? []).slice(0, limit).map((study) => {
      const protocol = study.protocolSection;
      const nctId = protocol?.identificationModule?.nctId ?? "unknown-nct";
      const title =
        protocol?.identificationModule?.briefTitle ?? `ClinicalTrials.gov study ${nctId}`;
      const status = protocol?.statusModule?.overallStatus ?? "Status not listed";
      const sponsor = protocol?.sponsorCollaboratorsModule?.leadSponsor?.name;
      const phase = protocol?.designModule?.phases?.join(", ") || "Phase not listed";
      const conditions = protocol?.conditionsModule?.conditions ?? [];
      const interventions =
        protocol?.armsInterventionsModule?.interventions
          ?.map((intervention) => intervention.name)
          .filter(Boolean) as string[] | undefined;
      const url = `https://clinicaltrials.gov/study/${nctId}`;
      const lastUpdate =
        protocol?.statusModule?.lastUpdatePostDateStruct?.date ?? "";
      const snapshot = {
        status,
        phase,
        sponsor: sponsor ?? "",
        conditions: conditions.join("|"),
        interventions: interventions?.join("|") ?? "",
        lastUpdate,
      };
      const change = changeNoteFor(nctId, snapshot);

      return {
        id: nctId,
        sourceId: "clinical-trials",
        sourceName: "ClinicalTrials.gov",
        sourceType: "Primary source",
        trustLevel: "Very high",
        title,
        summary: [
          `NCT ID: ${nctId}.`,
          `Status: ${status}.`,
          `Phase: ${phase}.`,
          sponsor ? `Sponsor: ${sponsor}.` : "",
          conditions.length ? `Conditions: ${conditions.slice(0, 3).join(", ")}.` : "",
          change.changeDetected
            ? "A change was detected against the in-memory session snapshot."
            : "No prior persisted history is available; Build 4 compares only in-memory snapshots.",
        ]
          .filter(Boolean)
          .join(" "),
        url,
        publishedAt: parseDate(lastUpdate),
        eventType: "Clinical Trial",
        sourceStatus: "Primary confirmed",
        evidenceStatus: "Clinical trial registry",
        sourceTrail: [
          {
            sourceName: "ClinicalTrials.gov",
            sourceType: "Primary source",
            trustLevel: "Very high",
            role: "Origin",
            status: "Primary confirmed",
            requiresPrimaryConfirmation: false,
            sourceUrl: url,
            note: `${nctId}. Registry metadata only; BioIntel does not yet diff trial record changes.`,
          },
        ],
        metadata: {
          sponsor,
          conditions,
          interventions,
          phase,
          status,
          nctId,
          changeDetected: change.changeDetected ? "true" : "false",
        },
        changeDetected: change.changeDetected,
        changeNote: change.changeNote,
      };
    });

    const result: SourceFetchResult = {
      items,
      status: {
        source: "ClinicalTrials.gov",
        status: "ok",
        count: items.length,
      },
    };
    setCachedValue(key, result, 2 * 60 * 1000);
    return result;
  } catch (error) {
    return {
      items: [],
      status: {
        source: "ClinicalTrials.gov",
        status: "error",
        count: 0,
        error:
          error instanceof Error
            ? error.message
            : "ClinicalTrials.gov fetch failed",
      },
    };
  }
}
