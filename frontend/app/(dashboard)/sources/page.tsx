const sources = [
  { name: "google_news", status: "Active", lastRun: "2m ago", success: "98%" },
  { name: "sec_filings", status: "Active", lastRun: "11m ago", success: "95%" },
  { name: "state_rfp", status: "Paused", lastRun: "3h ago", success: "91%" },
];

export default function Page() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">Source Management</h1>
      <div className="rounded-xl border p-4 bg-white dark:bg-slate-900">
        <button className="px-4 py-2 rounded-md bg-blue-600 text-white">
          Trigger Selected Scrape
        </button>
      </div>
      <div className="rounded-xl border overflow-hidden bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Source</th>
              <th>Status</th>
              <th>Last run</th>
              <th>Success</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.name} className="border-t">
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
