import { useEffect, useState, useCallback } from "react";
import { Search as SearchIcon, Loader2, SearchX, TrendingUp, Clock, Tag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(["AI Agent", "DeFi", "Web3"]);
  const [trendingSearches] = useState(["Autonomous", "Scaling", "Neural"]);

  useEffect(() => {
    searchProjects();
  }, []);

  async function searchProjects(search = "") {
    setLoading(true);
    setError(null);

    let request = supabase
      .from("Projects")
      .select("*")
      .eq("status", "Active");

    if (search.trim()) {
      request = request.or(
        `name.ilike.%${search}%,builder.ilike.%${search}%,category.ilike.%${search}%,tags.ilike.%${search}%`
      );
    }

    const { data, error } = await request.order("likes", {
      ascending: false,
    });

    if (error) {
      console.error(error);
      setError("Failed to search projects. Please try again.");
      setLoading(false);
      return;
    }

    setProjects(data || []);
    setLoading(false);
    
    if (search.trim() && !recentSearches.includes(search)) {
      setRecentSearches(prev => [search, ...prev.slice(0, 4)]);
    }
  }

  const handleSearch = (q) => {
    setQuery(q);
    searchProjects(q);
  };

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
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12"
          >
            <h1 className="mb-8 flex items-center gap-3 text-4xl font-black sm:text-6xl text-white">
              <SearchIcon size={48} className="text-emerald-400" />
              Explore Ritual
            </h1>

            <div className="relative group max-w-3xl">
              <SearchIcon
                size={24}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition"
              />

              <input
                type="text"
                placeholder="Search by project, builder, category or tag..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl py-6 pl-16 pr-8 text-xl text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
            
            {/* Quick Filters/Recent Searches */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-zinc-400"><Clock size={16}/> Recent:</div>
              {recentSearches.map(s => (
                <button key={s} onClick={() => handleSearch(s)} className="rounded-full bg-zinc-800 px-4 py-1.5 text-sm hover:bg-zinc-700 transition">{s}</button>
              ))}
              <div className="flex items-center gap-2 text-zinc-400 ml-4"><TrendingUp size={16}/> Trending:</div>
              {trendingSearches.map(s => (
                <button key={s} onClick={() => handleSearch(s)} className="rounded-full bg-emerald-500/10 text-emerald-400 px-4 py-1.5 text-sm hover:bg-emerald-500/20 transition">{s}</button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" className="flex flex-col items-center justify-center py-24 text-zinc-400">
                <Loader2 size={40} className="animate-spin text-emerald-400" />
                <p className="mt-4">Searching projects...</p>
              </motion.div>
            ) : error ? (
              <motion.div key="error" className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
                <h2 className="text-2xl font-bold">Something went wrong</h2>
                <p className="mt-3 text-zinc-500">{error}</p>
                <button
                  onClick={() => searchProjects(query)}
                  className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
                >
                  Try Again
                </button>
              </motion.div>
            ) : projects.length === 0 ? (
              <motion.div key="empty" className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
                <SearchX size={48} className="mx-auto text-zinc-600" />
                <h2 className="mt-6 text-2xl font-bold">No Projects Found</h2>
                <p className="mt-3 text-zinc-500">
                  Try a different search term.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
              >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      <Footer />
    </>
  );
}