import { defaultWatchlist } from "@/src/data/defaultData";

export interface TopicMatch {
  topic: string;
  terms: string[];
  score: number;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildTopicMatches(topics: string[]) {
  const requested = topics.map(normalizeText);

  return defaultWatchlist
    .filter((item) => item.enabled)
    .map((item) => {
      const terms = unique([item.name, ...item.synonyms].map(normalizeText));
      const requestedMatch =
        requested.length === 0 ||
        requested.some((topic) =>
          terms.some((term) => topic.includes(term) || term.includes(topic)),
        );

      if (!requestedMatch) return null;

      return {
        topic: item.name,
        terms,
        score: item.priority === "High" ? 3 : item.priority === "Medium" ? 2 : 1,
      };
    })
    .filter((match): match is TopicMatch => Boolean(match));
}

export function matchTopicsInText(text: string, topicMatches: TopicMatch[]) {
  const normalizedText = normalizeText(text);
  const matches = topicMatches.filter((match) =>
    match.terms.some((term) => {
      if (term.length < 3) return false;
      return normalizedText.includes(term);
    }),
  );

  return matches.sort((a, b) => b.score - a.score);
}

export function searchTermsFromMatches(topicMatches: TopicMatch[]) {
  return unique(topicMatches.flatMap((match) => match.terms)).slice(0, 16);
}
