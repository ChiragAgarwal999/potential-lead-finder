"use client";

import Link from "next/link";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

const nav = ["overview", "sources", "events", "geography", "opportunities", "admin"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white flex">
        <aside className={`${collapsed ? "w-20" : "w-64"} transition-all border-r border-slate-800 bg-slate-900 p-4`}>
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-blue-400">PLF</p>
            <button onClick={() => setCollapsed(!collapsed)}><Menu /></button>
          </div>
          <div className="space-y-2">
            {nav.map((n) => (
              <Link key={n} href={`/${n}`} className="block rounded-lg px-3 py-2 hover:bg-slate-800 capitalize">
                {n}
              </Link>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur flex items-center justify-between">
            <div className="relative w-[420px] max-w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent pl-9 pr-3 py-2" placeholder="Search entities, events, opportunities" />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setDark(!dark)} className="rounded-md border p-2 border-slate-300 dark:border-slate-700">{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
              <button className="rounded-md border p-2 border-slate-300 dark:border-slate-700"><Bell className="w-4 h-4" /></button>
              <button className="rounded-full bg-blue-600 text-white px-3 py-1 text-sm">John D.</button>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
