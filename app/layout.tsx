import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/src/components/AppShell";
import { PreferencesProvider } from "@/src/components/PreferencesContext";

export const metadata: Metadata = {
  title: "BioIntel Briefing",
  description: "Source-backed biotech and pharma intelligence dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PreferencesProvider>
          <AppShell>{children}</AppShell>
        </PreferencesProvider>
      </body>
    </html>
  );
}
