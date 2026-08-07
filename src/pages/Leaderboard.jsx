import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart, Eye, Medal, Loader2, Boxes, Users, Search, ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Leaderboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("likes");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("status", "Active")
      .order("likes", { ascending: false });

    if (error) {
      console.error(error);
      setError("Failed to load leaderboard. Please try again.");
      setLoading(false);
      return;
    }

    setProjects(data || []);
    setLoading(false);
  }

  const filteredProjects = useMemo(() => {
    let sorted = [...projects].sort((a, b) => (b[filter] || 0) - (a[filter] || 0));
    if (search) {
      sorted = sorted.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.builder?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return sorted;
  }, [projects, search, filter]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading leaderboard...</p>
          </div>
        </main>
      </>
    );
  }

  const totalLikes = projects.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalBuilders = new Set(projects.map((p) => p.builder).filter(Boolean)).size;

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
          {/* Hero Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl font-black md:text-6xl text-white">
              The <span className="text-emerald-400">Ritual</span> Leaderboard
            </h1>
            <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
              Celebrating the most innovative agents and builders in the ecosystem. Ranked by community impact.
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="mb-16 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Boxes, value: projects.length, label: "Projects" },
              { icon: Heart, value: totalLikes, label: "Total Likes" },
              { icon: Eye, value: totalViews, label: "Total Views" },
              { icon: Users, value: totalBuilders, label: "Builders" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl"
              >
                <stat.icon size={24} className="mb-3 text-emerald-400" />
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Top 3 Podium */}
          {filteredProjects.length >= 3 && (
            <div className="mb-16 grid gap-6 md:grid-cols-3 items-end">
              {filteredProjects.slice(0, 3).map((project, index) => {
                const ranks = [2, 1, 3]; // Silver, Gold, Bronze
                const actualIndex = ranks.indexOf(index + 1); // Not quite right, fixing logic
              })}
              {/* Simplified Podium Logic */}
              {[filteredProjects[1], filteredProjects[0], filteredProjects[2]].map((project, i) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -10 }}
                  className={`rounded-3xl border ${i === 1 ? 'border-yellow-500/50 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/60'} p-8 text-center`}
                >
                  <Trophy size={48} className={i === 1 ? 'text-yellow-400 mx-auto' : 'text-zinc-500 mx-auto'} />
                  <p className="mt-4 font-black text-2xl">{project.name}</p>
                  <p className="text-emerald-400 font-semibold">{project.builder}</p>
                  <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center gap-1"><Heart size={16} className="text-red-400"/> {project.likes}</div>
                    <div className="flex items-center gap-1"><Eye size={16} className="text-cyan-400"/> {project.views}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Filter & Table */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white outline-none"
            >
              <option value="likes">Sort by Likes</option>
              <option value="views">Sort by Views</option>
            </select>
          </div>

          <motion.div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="p-6">Rank</th>
                  <th className="p-6">Agent</th>
                  <th className="p-6">Builder</th>
                  <th className="p-6 text-right">Likes</th>
                  <th className="p-6 text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <AnimatePresence>
                  {filteredProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-zinc-800/30 transition"
                    >
                      <td className="p-6 font-bold text-zinc-500">#{index + 1}</td>
                      <td className="p-6 font-semibold"><Link to={`/project/${project.id}`} className="hover:text-emerald-400">{project.name}</Link></td>
                      <td className="p-6 text-zinc-400">{project.builder}</td>
                      <td className="p-6 text-right font-mono text-emerald-400">{project.likes || 0}</td>
                      <td className="p-6 text-right font-mono text-cyan-400">{project.views || 0}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </>
  );
}