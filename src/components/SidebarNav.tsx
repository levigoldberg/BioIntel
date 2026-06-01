"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Today" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/sources", label: "Sources" },
  { href: "/settings", label: "Settings" },
  { href: "/archive", label: "Archive" },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-slate-200 bg-white/90 px-4 py-3 md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6">
      <div className="mb-4 flex items-center justify-between md:block">
        <Link href="/" className="block">
          <p className="text-lg font-black tracking-tight text-slate-950">
            BioIntel
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
            Signals, not news
          </p>
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${active ? "bg-slate-950 text-white shadow-soft" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:block">
        <p className="font-semibold text-slate-900">Live-source scope</p>
        <p className="mt-1">
          Server-side public source ingestion with source trust and evidence
          status visible in every signal.
        </p>
      </div>
    </aside>
  );
}
