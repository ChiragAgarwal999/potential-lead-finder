"use client";

import { Fragment, useState } from "react";

type ScrapedItem = {
  title: string;
  source: string;
  published_at: string;
  url: string;
};

type SourceRow = {
  name: string;
  status: "Active" | "Paused";
  lastRun: string;
  success: string;
};

type ScrapeItem = {
  title: string;
  url: string;
  source: string;
  published_at: string;
  event_type: string;
  impact_score: number;
  clean_text_preview?: string;
  entities: {
    organizations: string[];
    people?: string[];
    locations: string[];
    money: string[];
    dates?: string[];
  };
};

const sources: SourceRow[] = [
  { name: "google_news", status: "Active", lastRun: "2m ago", success: "98%" },
  { name: "sec_filings", status: "Active", lastRun: "11m ago", success: "95%" },
  { name: "state_rfp", status: "Paused", lastRun: "3h ago", success: "91%" },
];

const impactClasses = (score: number) => {
  if (score >= 80) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  if (score >= 60) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
  if (score >= 40) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
};

export default function Page() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [query, setQuery] = useState("infrastructure projects");
  const [isScraping, setIsScraping] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [scrapedItems, setScrapedItems] = useState<ScrapeItem[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleSource = (sourceName: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((name) => name !== sourceName)
        : [...prev, sourceName],
    );
  };

  const handleTriggerSelectedScrape = async () => {
    if (selectedSources.length === 0) {
      setResultMessage("Select at least one source before triggering a scrape.");
      return;
    }

    setIsScraping(true);
    setScrapedItems([]);

    try {
      const response = await fetch("http://localhost:8000/api/v1/scrape/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sources: selectedSources,
          query,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || `Scrape request failed (${response.status})`);
      }

      const items: ScrapeItem[] = data?.items ?? [];
      setScrapedItems(items);
      setExpandedRow(null);
      setResultMessage(
        `Intelligence pipeline completed for ${selectedSources.length} source(s). ${data?.count ?? 0} processed article(s).`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred during scrape.";
      setResultMessage(`Unable to complete scrape: ${message}`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Source Management</h1>
      <div className="rounded-xl border p-4 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
        <div className="flex flex-col gap-2 max-w-xl">
          <label htmlFor="scrape-query" className="text-sm font-medium">Scrape query</label>
          <input
            id="scrape-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="border rounded-md px-3 py-2 bg-transparent"
            placeholder="Enter search query"
          />
        </div>

        <button
          onClick={handleTriggerSelectedScrape}
          disabled={isScraping}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
        >
          {isScraping ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
          {isScraping ? "Processing articles..." : "Trigger Selected Scrape"}
        </button>

        {resultMessage ? <p className="text-sm text-slate-600 dark:text-slate-300">{resultMessage}</p> : null}
      </div>

      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Select</th><th className="p-3 text-left">Source</th><th>Status</th><th>Last run</th><th>Success</th>
            </tr>
          </thead>
          <tbody>{sources.map((s) => (<tr key={s.name} className="border-t"><td className="p-3"><input type="checkbox" checked={selectedSources.includes(s.name)} onChange={() => toggleSource(s.name)} aria-label={`Select ${s.name}`} /></td><td className="p-3">{s.name}</td><td>{s.status}</td><td>{s.lastRun}</td><td>{s.success}</td></tr>))}</tbody>
        </table>
      </div>

      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="p-3 font-medium border-b">Processed Intelligence</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="p-3 text-left">Title</th><th className="p-3 text-left">Source</th><th className="p-3 text-left">Published</th><th className="p-3 text-left">Event Type</th><th className="p-3 text-left">Impact Score</th><th className="p-3 text-left">Organizations</th><th className="p-3 text-left">Locations</th><th className="p-3 text-left">Money</th><th className="p-3 text-left">Open Link</th>
              </tr>
            </thead>
            <tbody>
              {scrapedItems.length === 0 ? (
                <tr><td className="p-6 text-slate-500 text-center" colSpan={9}>No intelligence results yet. Trigger a scrape.</td></tr>
              ) : (
                scrapedItems.map((item, index) => (
                  <Fragment key={`${item.url}-${index}`}>
                    <tr key={`${item.url}-${index}`} className="border-t align-top cursor-pointer" onClick={() => setExpandedRow(expandedRow === item.url ? null : item.url)}>
                      <td className="p-3 max-w-xs">{item.title}</td>
                      <td className="p-3">{item.source}</td>
                      <td className="p-3">{item.published_at ? new Date(item.published_at).toLocaleString() : "—"}</td>
                      <td className="p-3"><span className="rounded-full px-2 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700">{item.event_type}</span></td>
                      <td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${impactClasses(item.impact_score)}`}>{item.impact_score}</span></td>
                      <td className="p-3">{item.entities.organizations.join(", ") || "—"}</td>
                      <td className="p-3">{item.entities.locations.join(", ") || "—"}</td>
                      <td className="p-3">{item.entities.money.join(", ") || "—"}</td>
                      <td className="p-3"><a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline" onClick={(event) => event.stopPropagation()}>Open</a></td>
                    </tr>
                    {expandedRow === item.url ? (
                      <tr className="border-t bg-slate-50 dark:bg-slate-800/30"><td colSpan={9} className="p-4"><div className="space-y-2 text-sm"><p><span className="font-semibold">Preview:</span> {item.clean_text_preview || "No cleaned preview available."}</p><p><span className="font-semibold">Entities:</span> ORG: {item.entities.organizations.join(", ") || "—"} | LOC: {item.entities.locations.join(", ") || "—"} | MONEY: {item.entities.money.join(", ") || "—"}</p><p><span className="font-semibold">Classification:</span> {item.event_type} | <span className="font-semibold">Impact:</span> {item.impact_score}</p></div></td></tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
