import type { RawSourceItem, SourceFetchResult } from "./types";
import { cacheKey, getCachedValue, setCachedValue } from "./cache";
import { fetchWithTimeout } from "./http";

const fdaFeeds = [
  {
    id: "press-releases",
    name: "FDA Press Releases",
    url: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml",
    eventType: "Regulatory" as const,
  },
  {
    id: "medwatch",
    name: "FDA MedWatch Safety Alerts",
    url: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/medwatch/rss.xml",
    eventType: "Safety Signal" as const,
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
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseRssItems(xml: string) {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  return itemMatches.map((block) => ({
    title: readTag(block, "title"),
    description: readTag(block, "description"),
    link: readTag(block, "link"),
    pubDate: readTag(block, "pubDate"),
    guid: readTag(block, "guid"),
  }));
}

function matchesTopics(title: string, summary: string, topics: string[]) {
  if (topics.length === 0) return true;
  const text = `${title} ${summary}`.toLowerCase();
  return topics.some((topic) => text.includes(topic.toLowerCase()));
}

function parseDate(value: string) {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

export async function fetchFdaItems(
  searchTerms: string[],
  limit: number,
): Promise<SourceFetchResult> {
  const key = cacheKey({ source: "fda", searchTerms, limit });
  const cached = getCachedValue<SourceFetchResult>(key);
  if (cached) return cached;

  try {
    const feedResults = await Promise.all(
      fdaFeeds.map(async (feed) => {
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
          sourceId: "fda",
          sourceName: feed.name,
          sourceType: "Primary source",
          trustLevel: "Very high",
          title: item.title,
          summary: item.description,
          url,
          publishedAt,
          eventType: feed.eventType,
          sourceStatus: "Primary confirmed",
          evidenceStatus: "Regulatory source",
          sourceTrail: [
            {
              sourceName: feed.name,
              sourceType: "Primary source",
              trustLevel: "Very high",
              role: "Origin",
              status: "Primary confirmed",
              requiresPrimaryConfirmation: false,
              sourceUrl: url,
              note: "FDA RSS item fetched server-side from a public FDA feed.",
            },
          ],
        };
      });

    const result: SourceFetchResult = {
      items,
      status: { source: "FDA", status: "ok", count: items.length },
    };
    setCachedValue(key, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    return {
      items: [],
      status: {
        source: "FDA",
        status: "error",
        count: 0,
        error: error instanceof Error ? error.message : "FDA fetch failed",
      },
    };
  }
}
