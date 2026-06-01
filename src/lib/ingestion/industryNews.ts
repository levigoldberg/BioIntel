import { cacheKey, getCachedValue, setCachedValue } from "./cache";
import { fetchWithTimeout } from "./http";
import type { RawSourceItem, SourceFetchResult } from "./types";

const newsFeeds = [
  {
    id: "fierce-biotech",
    name: "Fierce Biotech",
    url: "https://www.fiercebiotech.com/rss/xml",
    trustLevel: "Medium" as const,
  },
  {
    id: "fierce-pharma",
    name: "Fierce Pharma",
    url: "https://www.fiercepharma.com/rss/xml",
    trustLevel: "Medium" as const,
  },
  {
    id: "biopharma-dive",
    name: "BioPharma Dive",
    url: "https://www.biopharmadive.com/feeds/news/",
    trustLevel: "Medium" as const,
  },
];

function decodeXml(value: string) {
  return value
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(block: string, tag: string) {
  const match = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  return match ? decodeXml(match[1]) : "";
}

function parseRssItems(xml: string) {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  return itemMatches.map((block) => ({
    title: readTag(block, "title"),
    description: readTag(block, "description"),
    link: readTag(block, "link"),
    pubDate: readTag(block, "pubDate") || readTag(block, "dc:date"),
    guid: readTag(block, "guid"),
  }));
}

function matchesTopics(title: string, summary: string, searchTerms: string[]) {
  if (searchTerms.length === 0) return true;
  const text = `${title} ${summary}`.toLowerCase();
  return searchTerms.some((term) => text.includes(term.toLowerCase()));
}

function eventTypeFor(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();
  if (text.includes("fda") || text.includes("approval") || text.includes("regulatory")) {
    return "Regulatory" as const;
  }
  if (text.includes("trial") || text.includes("phase ") || text.includes("clinical")) {
    return "Clinical Trial" as const;
  }
  if (text.includes("safety") || text.includes("adverse") || text.includes("recall")) {
    return "Safety Signal" as const;
  }
  if (text.includes("deal") || text.includes("financ") || text.includes("acquir")) {
    return "Deal / Financing" as const;
  }
  if (text.includes("ai") || text.includes("machine learning")) {
    return "AI Drug Discovery" as const;
  }
  return "Company Update" as const;
}

function parseDate(value: string) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

export async function fetchIndustryNewsItems(
  searchTerms: string[],
  limit: number,
): Promise<SourceFetchResult> {
  const key = cacheKey({ source: "industry-news", searchTerms, limit });
  const cached = getCachedValue<SourceFetchResult>(key);
  if (cached) return cached;

  try {
    const feedResults = await Promise.all(
      newsFeeds.map(async (feed) => {
        const response = await fetchWithTimeout(feed.url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`${feed.name} returned ${response.status}`);
        }
        const xml = await response.text();
        return parseRssItems(xml).map((item) => ({ feed, item }));
      }),
    );

    const items: RawSourceItem[] = feedResults
      .flat()
      .filter(({ item }) => item.title && item.link)
      .filter(({ item }) =>
        matchesTopics(item.title, item.description, searchTerms),
      )
      .slice(0, limit)
      .map(({ feed, item }, index) => {
        const publishedAt = parseDate(item.pubDate);
        const url = item.link || item.guid || feed.url;

        return {
          id: `${feed.id}-${index}-${encodeURIComponent(url).slice(0, 40)}`,
          sourceId: "industry-news",
          sourceName: feed.name,
          sourceType: "Industry news",
          trustLevel: feed.trustLevel,
          title: item.title,
          summary:
            item.description ||
            "Industry news RSS metadata is available; full article analysis is not performed.",
          url,
          publishedAt,
          eventType: eventTypeFor(item.title, item.description),
          sourceStatus: "Secondary only",
          evidenceStatus: "Industry news",
          sourceTrail: [
            {
              sourceName: feed.name,
              sourceType: "Industry news",
              trustLevel: feed.trustLevel,
              role: "Context",
              status: "Secondary only",
              requiresPrimaryConfirmation: true,
              sourceUrl: url,
              note: "Non-paywalled industry RSS item fetched server-side. Treat as context until primary sources confirm major claims.",
            },
          ],
        };
      });

    const result: SourceFetchResult = {
      items,
      status: {
        source: "Industry News",
        status: "ok",
        count: items.length,
      },
    };
    setCachedValue(key, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    return {
      items: [],
      status: {
        source: "Industry News",
        status: "error",
        count: 0,
        error:
          error instanceof Error ? error.message : "Industry news fetch failed",
      },
    };
  }
}
