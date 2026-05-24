"use client";

import { Fragment, useState } from "react";

type ExtractedEntities = {
  organizations: string[];
  locations: string[];
  money: string[];
};

type ScrapedItem = {
  title: string;
  url: string;
  source: string;
  published_at: string;
  event_type: string;
  impact_score: number;
  clean_text?: string;
  entities: ExtractedEntities;
};

type SourceRow = {
  name: string;
  status: "Active" | "Paused";
  lastRun: string;
  success: string;
};

const sources: SourceRow[] = [
  { name: "google_news", status: "Active", lastRun: "2m ago", success: "98%" },
  { name: "sec_filings", status: "Active", lastRun: "11m ago", success: "95%" },
  { name: "state_rfp", status: "Paused", lastRun: "3h ago", success: "91%" },
];

const impactBadgeClass = (score: number) => {
  if (score >= 80) return "bg-red-100 text-red-700";
  if (score >= 60) return "bg-orange-100 text-orange-700";
  if (score >= 40) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
};

const formatPublishedDate = (publishedAt: string): string => {
  if (!publishedAt) return "—";
  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime())) return publishedAt;

  // Use fixed locale + UTC to avoid server/client locale-timezone hydration drift.
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: true,
  }).format(parsed);
};

export default function Page() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [query, setQuery] = useState("infrastructure projects");
  const [isScraping, setIsScraping] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [scrapeErrors, setScrapeErrors] = useState<string[]>([]);
  const [scrapedItems, setScrapedItems] = useState<ScrapedItem[]>([]);

  const toggleSource = (sourceName: string) => {
    setSelectedSources((previous) =>
      previous.includes(sourceName)
        ? previous.filter((name) => name !== sourceName)
        : [...previous, sourceName],
    );
  };

  const toggleExpanded = (rowKey: string) => {
    setExpandedRows((previous) =>
      previous.includes(rowKey) ? previous.filter((item) => item !== rowKey) : [...previous, rowKey],
    );
  };

  const handleTriggerSelectedScrape = async () => {
    if (selectedSources.length === 0) {
      setResultMessage("Select at least one source before triggering a scrape.");
      return;
    }

    setIsScraping(true);
    setResultMessage(null);
    setScrapeErrors([]);

    try {
      const response = await fetch("http://localhost:8000/api/v1/scrape/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: selectedSources, query }),
      });

      if (!response.ok) {
        throw new Error(`Scrape request failed (${response.status})`);
      }

      const data = await response.json();
      setScrapedItems(data?.items ?? []);
      setScrapeErrors((data?.errors ?? []).map((error: { source: string; error: string }) => `${error.source}: ${error.error}`));
      setResultMessage(`Scrape completed for ${selectedSources.length} source(s). ${data?.count ?? 0} lead(s) returned.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred during scrape.";
      setResultMessage(`Unable to complete scrape: ${message}`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Source Management</h1>

      <div className="rounded-xl border p-4 bg-white dark:bg-slate-900 space-y-3">
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
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60 inline-flex items-center gap-2"
        >
          {isScraping ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Processing articles...
            </>
          ) : "Trigger Selected Scrape"}
        </button>

        {resultMessage ? <p className="text-sm text-slate-600 dark:text-slate-300">{resultMessage}</p> : null}
        {scrapeErrors.length > 0 ? (
          <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
            <p className="font-medium">Some sources failed:</p>
            <ul className="list-disc ml-5">{scrapeErrors.map((error) => <li key={error}>{error}</li>)}</ul>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Select</th><th className="p-3 text-left">Source</th><th>Status</th><th>Last run</th><th>Success</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.name} className="border-t">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.name)}
                    onChange={() => toggleSource(source.name)}
                    aria-label={`Select ${source.name}`}
                  />
                </td>
                <td className="p-3">{source.name}</td>
                <td>{source.status}</td>
                <td>{source.lastRun}</td>
                <td>{source.success}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-3 font-medium border-b">Scrape Results Intelligence</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Title</th><th className="p-3 text-left">Source</th><th className="p-3 text-left">Published</th>
              <th className="p-3 text-left">Event Type</th><th className="p-3 text-left">Impact</th><th className="p-3 text-left">Organizations</th>
              <th className="p-3 text-left">Locations</th><th className="p-3 text-left">Money</th><th className="p-3 text-left">Open Link</th>
            </tr>
          </thead>
          <tbody>
            {scrapedItems.length === 0 ? (
              <tr><td className="p-5 text-slate-500 text-center" colSpan={9}>No intelligence results yet. Trigger a scrape.</td></tr>
            ) : scrapedItems.map((item, index) => {
              const rowKey = `${item.url}-${index}`;
              const isExpanded = expandedRows.includes(rowKey);
              return (
                <Fragment key={rowKey}>
                  <tr className="border-t align-top cursor-pointer hover:bg-slate-50" onClick={() => toggleExpanded(rowKey)}>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.source}</td>
                    <td className="p-3">{formatPublishedDate(item.published_at)}</td>
                    <td className="p-3"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{item.event_type}</span></td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-full ${impactBadgeClass(item.impact_score)}`}>{item.impact_score}</span></td>
                    <td className="p-3">{item.entities.organizations.join(", ") || "—"}</td>
                    <td className="p-3">{item.entities.locations.join(", ") || "—"}</td>
                    <td className="p-3">{item.entities.money.join(", ") || "—"}</td>
                    <td className="p-3"><a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline" onClick={(event) => event.stopPropagation()}>Open</a></td>
                  </tr>
                  {isExpanded ? (
                    <tr className="border-t bg-slate-50/60">
                      <td className="p-4" colSpan={9}>
                        {/* Expanded intelligence preview for analyst triage. */}
                        <div className="space-y-2">
                          <p><span className="font-semibold">Classification:</span> {item.event_type}</p>
                          <p><span className="font-semibold">Impact Score:</span> {item.impact_score}</p>
                          <p><span className="font-semibold">Entities:</span> ORG [{item.entities.organizations.join(", ") || "—"}] • LOC [{item.entities.locations.join(", ") || "—"}] • MONEY [{item.entities.money.join(", ") || "—"}]</p>
                          <p className="text-slate-600"><span className="font-semibold text-slate-800">Cleaned Preview:</span> {item.clean_text?.slice(0, 420) || "No cleaned text available."}</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
