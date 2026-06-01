import type { RawSourceItem, SourceFetchResult } from "./types";
import { cacheKey, getCachedValue, setCachedValue } from "./cache";

interface PubMedSummary {
  uid: string;
  title?: string;
  fulljournalname?: string;
  pubdate?: string;
  sortpubdate?: string;
  authors?: Array<{ name?: string }>;
}

interface PubMedSummaryResponse {
  result?: {
    uids?: string[];
    [uid: string]: PubMedSummary | string[] | undefined;
  };
}

function pubDateToIso(summary: PubMedSummary) {
  const dateText = summary.sortpubdate ?? summary.pubdate;
  if (!dateText) return new Date().toISOString();
  const parsed = new Date(dateText);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function buildSearchTerm(topics: string[]) {
  const usefulTopics = topics.filter((topic) => topic.length > 2).slice(0, 6);
  if (usefulTopics.length === 0) return "biotechnology";
  return usefulTopics.map((topic) => `"${topic}"`).join(" OR ");
}

export async function fetchPubMedItems(
  searchTerms: string[],
  limit: number,
): Promise<SourceFetchResult> {
  const key = cacheKey({ source: "pubmed", searchTerms, limit });
  const cached = getCachedValue<SourceFetchResult>(key);
  if (cached) return cached;

  try {
    const term = buildSearchTerm(searchTerms);
    const searchParams = new URLSearchParams({
      db: "pubmed",
      retmode: "json",
      sort: "pub+date",
      retmax: String(Math.min(limit, 8)),
      term,
    });
    const searchResponse = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${searchParams}`,
      { cache: "no-store" },
    );
    if (!searchResponse.ok) {
      throw new Error(`PubMed ESearch returned ${searchResponse.status}`);
    }
    const searchData = (await searchResponse.json()) as {
      esearchresult?: { idlist?: string[] };
    };
    const ids = searchData.esearchresult?.idlist ?? [];
    if (ids.length === 0) {
      const emptyResult: SourceFetchResult = {
        items: [],
        status: { source: "PubMed", status: "ok", count: 0 },
      };
      setCachedValue(key, emptyResult, 5 * 60 * 1000);
      return emptyResult;
    }

    const summaryParams = new URLSearchParams({
      db: "pubmed",
      retmode: "json",
      id: ids.join(","),
    });
    const summaryResponse = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?${summaryParams}`,
      { cache: "no-store" },
    );
    if (!summaryResponse.ok) {
      throw new Error(`PubMed ESummary returned ${summaryResponse.status}`);
    }

    const summaryData = (await summaryResponse.json()) as PubMedSummaryResponse;
    const items: RawSourceItem[] = (summaryData.result?.uids ?? [])
      .map((uid) => summaryData.result?.[uid])
      .filter((summary): summary is PubMedSummary => {
        return Boolean(summary && !Array.isArray(summary) && summary.uid);
      })
      .slice(0, limit)
      .map((summary) => {
        const authors = summary.authors
          ?.map((author) => author.name)
          .filter(Boolean)
          .slice(0, 3) as string[] | undefined;
        const url = `https://pubmed.ncbi.nlm.nih.gov/${summary.uid}/`;

        return {
          id: summary.uid,
          sourceId: "pubmed",
          sourceName: "PubMed",
          sourceType: "Scientific literature",
          trustLevel: "High",
          title: summary.title ?? `PubMed record ${summary.uid}`,
          summary: [
            summary.fulljournalname ? `Journal: ${summary.fulljournalname}.` : "",
            authors?.length ? `Authors: ${authors.join(", ")}.` : "",
            "Metadata exists in PubMed; BioIntel does not summarize full papers yet.",
          ]
            .filter(Boolean)
            .join(" "),
          url,
          publishedAt: pubDateToIso(summary),
          eventType: "Publication",
          sourceStatus: "Primary confirmed",
          evidenceStatus: "Scientific literature",
          sourceTrail: [
            {
              sourceName: "PubMed",
              sourceType: "Scientific literature",
              trustLevel: "High",
              role: "Origin",
              status: "Primary confirmed",
              requiresPrimaryConfirmation: false,
              sourceUrl: url,
              note: `PMID ${summary.uid}. Journal metadata is available; study conclusions are not summarized yet.`,
            },
          ],
          metadata: {
            journal: summary.fulljournalname,
            authors,
          },
        };
      });

    const result: SourceFetchResult = {
      items,
      status: { source: "PubMed", status: "ok", count: items.length },
    };
    setCachedValue(key, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    return {
      items: [],
      status: {
        source: "PubMed",
        status: "error",
        count: 0,
        error: error instanceof Error ? error.message : "PubMed fetch failed",
      },
    };
  }
}
