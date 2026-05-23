import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
const data = [
  { m: "Jan", v: 34 },
  { m: "Feb", v: 51 },
  { m: "Mar", v: 66 },
  { m: "Apr", v: 72 },
];
export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Overview Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {[
          "Total scraped leads",
          "New events detected",
          "High impact opportunities",
          "Growth sentiment score",
        ].map((k, i) => (
          <div
            key={k}
            className="rounded-xl border p-4 bg-white dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500">{k}</p>
            <p className="text-2xl font-bold">{[4280, 127, 46, "78%"][i]}</p>
          </div>
        ))}
      </div>
      <div className="h-72 rounded-xl border p-4 bg-white dark:bg-slate-900">
        <h2 className="font-medium mb-3">Trend Chart</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="m" />
            <Bar dataKey="v" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
