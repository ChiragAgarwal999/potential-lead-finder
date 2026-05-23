"use client";

import axios from "axios";
import { useState } from "react";

type SourceRow = {
  name: string;
  status: "Active" | "Paused";
  lastRun: string;
  success: string;
};

type ScrapedItem = {
  title: string;
  url: string;
  source: string;
  published_at: string;
  content: string;
};

const sources: SourceRow[] = [
  { name: "google_news", status: "Active", lastRun: "2m ago", success: "98%" },
  { name: "sec_filings", status: "Active", lastRun: "11m ago", success: "95%" },
  { name: "state_rfp", status: "Paused", lastRun: "3h ago", success: "91%" },
];

export default function Page() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [query, setQuery] = useState("infrastructure projects");
  const [isScraping, setIsScraping] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [scrapedItems, setScrapedItems] = useState<ScrapedItem[]>([]);

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
    setResultMessage(null);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/scrape/trigger", {
        sources: selectedSources,
        query,
      });

      const data = response.data;
      const items: ScrapedItem[] = Array.isArray(data?.items) ? data.items : [];
      setScrapedItems(items);
      setResultMessage(
        `Scrape completed for ${selectedSources.length} source(s). ${items.length} lead(s) returned.`,
      );
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || error.message
        : "An unknown error occurred during scrape.";
      setScrapedItems([]);
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
          <label htmlFor="scrape-query" className="text-sm font-medium">
            Scrape query
          </label>
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
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
        >
          {isScraping ? "Scraping..." : "Trigger Selected Scrape"}
        </button>

        {resultMessage ? <p className="text-sm text-slate-600 dark:text-slate-300">{resultMessage}</p> : null}
      </div>

      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left">Source</th>
              <th>Status</th>
              <th>Last run</th>
              <th>Success</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.name} className="border-t">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(s.name)}
                    onChange={() => toggleSource(s.name)}
                    aria-label={`Select ${s.name}`}
                  />
                </td>
                <td className="p-3">{s.name}</td>
                <td>{s.status}</td>
                <td>{s.lastRun}</td>
                <td>{s.success}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-3 font-medium border-b">Scrape Results</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Published</th>
              <th className="p-3 text-left">URL</th>
            </tr>
          </thead>
          <tbody>
            {scrapedItems.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-500" colSpan={4}>
                  No results yet. Trigger a scrape to view returned leads.
                </td>
              </tr>
            ) : (
              scrapedItems.map((item, index) => (
                <tr key={`${item.url}-${index}`} className="border-t align-top">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.source}</td>
                  <td className="p-3">{new Date(item.published_at).toLocaleString()}</td>
                  <td className="p-3">
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      Open
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
