"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { defaultSettings } from "@/src/data/defaultData";
import {
  clearLocalValue,
  storageKeys,
  usePersistentState,
} from "@/src/lib/persistence";
import type { BriefingSettings } from "@/src/types/biointel";

interface PreferencesContextValue {
  settings: BriefingSettings;
  updateSettings: (nextSettings: BriefingSettings) => void;
  resetSettings: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = usePersistentState<BriefingSettings>(
    storageKeys.settings,
    defaultSettings,
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings: setSettings,
      resetSettings: () => {
        clearLocalValue(storageKeys.settings);
        setSettings(defaultSettings);
      },
    }),
    [setSettings, settings],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider.");
  }

  return context;
}
