import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AnalyticsChart({ projects }) {
  const data = projects
    .slice()
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((project) => ({
      name:
        project.name.length > 12
          ? project.name.substring(0, 12) + "..."
          : project.name,
      views: project.views || 0,
      likes: project.likes || 0,
    }));

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Top Projects
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

          <XAxis
            dataKey="name"
            stroke="#a1a1aa"
          />

          <YAxis stroke="#a1a1aa" />

          <Tooltip />

          <Bar
            dataKey="views"
            name="Views"
            fill="#22c55e"
          />

          <Bar
            dataKey="likes"
            name="Likes"
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}