"use client";

import { useEffect, useState } from "react";

export const storageKeys = {
  briefingControls: "biointel:briefing-controls",
  hiddenSignalIds: "biointel:hidden-signal-ids",
  lessLikeThisSignalIds: "biointel:less-like-this-signal-ids",
  savedSignalIds: "biointel:saved-signal-ids",
  settings: "biointel:settings",
  sources: "biointel:sources",
  watchlist: "biointel:watchlist",
};

function readStoredValue<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readLocalValue<T>(key: string, fallback: T) {
  return readStoredValue(key, fallback);
}

export function writeLocalValue<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearLocalValue(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));

  useEffect(() => {
    writeLocalValue(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
