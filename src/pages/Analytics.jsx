import { useEffect, useState } from "react";
import { BarChart3, FolderOpen, Trophy, Flame, Heart, Eye, Loader2, Boxes, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Analytics() {
  const [stats, setStats] = useState({
    projects: 0,
    builders: 0,
    likes: 0,
    views: 0,
    featured: 0,
  });
  const [categories, setCategories] = useState([]);
  const [topBuilders, setTopBuilders] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    const { data } = await supabase
      .from("Projects")
      .select("*")
      .eq("status", "Active");

    const projects = data || [];

    const builders = new Set(
      projects.map((p) => p.builder).filter(Boolean)
    ).size;

    setStats({
      projects: projects.length,
      builders,
      likes: projects.reduce((s, p) => s + (p.likes || 0), 0),
      views: projects.reduce((s, p) => s + (p.views || 0), 0),
      featured: projects.filter((p) => p.featured).length,
    });

    const categoryMap = {};

    projects.forEach((project) => {
      const category = project.category || "Other";

      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    setCategories(
      Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }))
    );

    const builderMap = {};

    projects.forEach((project) => {
      const builder = project.builder || "Unknown";

      if (!builderMap[builder]) {
        builderMap[builder] = {
          name: builder,
          projects: 0,
          likes: 0,
          views: 0,
        };
      }

      builderMap[builder].projects++;
      builderMap[builder].likes += project.likes || 0;
      builderMap[builder].views += project.views || 0;
    });

    setTopBuilders(
      Object.values(builderMap)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5)
    );

    setTopProjects(
      [...projects]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 5)
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading analytics...</p>
          </div>
        </main>
      </>
    );
  }

  const statCards = [
    { icon: Boxes, title: "Projects", value: stats.projects },
    { icon: Users, title: "Builders", value: stats.builders },
    { icon: Heart, title: "Likes", value: stats.likes },
    { icon: Eye, title: "Views", value: stats.views },
    { icon: Star, title: "Featured", value: stats.featured },
  ];

  const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <>
      <Navbar />

      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#09090B] px-4 py-12 text-white sm:px-6"
      >
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12 flex items-center gap-3 text-4xl font-black sm:text-5xl"
          >
            <BarChart3 size={40} className="text-emerald-400" />
            Ritual Ecosystem Analytics
          </motion.h1>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5 mb-12">
            {statCards.map((stat, i) => (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={stat.title}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl transition hover:border-emerald-500"
              >
                <stat.icon size={24} className="mb-4 text-emerald-400" />
                <h2 className="text-3xl font-black">{stat.value}</h2>
                <p className="text-zinc-400 mt-1">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-8 lg:grid-cols-2 mb-12">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl"
            >
              <h3 className="text-2xl font-bold mb-8">Projects by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "none" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl"
            >
              <h3 className="text-2xl font-bold mb-8">Likes per Builder</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBuilders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "none" }} />
                    <Bar dataKey="likes" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Top Projects Table */}
          <motion.section 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
          >
            <h3 className="text-2xl font-bold p-8 pb-0">Most Liked Projects</h3>
            <table className="w-full text-left mt-8">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="p-6">Project</th>
                  <th className="p-6">Builder</th>
                  <th className="p-6 text-right">Likes</th>
                  <th className="p-6 text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {topProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-800/30 transition">
                    <td className="p-6 font-semibold">{project.name}</td>
                    <td className="p-6 text-zinc-400">{project.builder}</td>
                    <td className="p-6 text-right text-emerald-400 font-mono">{project.likes}</td>
                    <td className="p-6 text-right text-cyan-400 font-mono">{project.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.section>
        </div>
      </motion.main>

      <Footer />
    </>
  );
}