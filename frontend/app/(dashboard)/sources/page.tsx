"use client";

import { useState } from "react";

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

export default function Page() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [query, setQuery] = useState("infrastructure projects");
  const [isScraping, setIsScraping] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

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

      if (!response.ok) {
        throw new Error(`Scrape request failed (${response.status})`);
      }

      const data = await response.json();
      const leadCount = data?.count ?? 0;
      setResultMessage(
        `Scrape completed for ${selectedSources.length} source(s). ${leadCount} lead(s) returned.`,
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
    </div>
  );
}
