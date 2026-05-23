import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const trend = [
  { month: "Jan", leads: 41 },
  { month: "Feb", leads: 67 },
  { month: "Mar", leads: 88 },
  { month: "Apr", leads: 103 },
  { month: "May", leads: 126 },
];

const metrics = [
  ["Total scraped leads", "4,280"],
  ["New events detected", "127"],
  ["High impact opportunities", "46"],
  ["Growth sentiment score", "78%"],
  ["Investment sentiment score", "74%"],
  ["Infrastructure sentiment score", "81%"],
];

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Overview Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-sm text-slate-500">{k}</p>
            <p className="text-2xl font-bold mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 h-80">
          <p className="font-medium mb-3">Lead Trend</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}><XAxis dataKey="month" /><Tooltip /><Bar dataKey="leads" fill="#2563eb" radius={[6,6,0,0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
          <p className="font-medium mb-3">Recent Extracted Events</p>
          <div className="space-y-3 text-sm">
            <div><p className="font-medium">Acme Power expands in Austin</p><p className="text-slate-500">Infra · 0.89 confidence</p></div>
            <div><p className="font-medium">Metro corridor RFP issued</p><p className="text-slate-500">Public Works · 0.82 confidence</p></div>
            <div><p className="font-medium">Cloud campus lease signed</p><p className="text-slate-500">Enterprise Growth · 0.77 confidence</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
