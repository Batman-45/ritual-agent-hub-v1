import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Loader2, SearchX, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [projects, setProjects] = useState([]);
  const [userInteractions, setUserInteractions] = useState({ likes: new Set(), bookmarks: new Set() });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    searchProjects(q);
  }, [searchParams]);

  async function searchProjects(search = "") {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    setError(null);
    console.log("SEARCH QUERY:", search);
    console.time("SEARCH_REQUEST");

    // Fetch projects and interactions concurrently
    const [projectsRes, userRes] = await Promise.all([
      (async () => {
        let request = supabase
          .from("Projects")
          .select("id, name, builder, category, tags, likes, views, featured, verified, logo, image, website")
          .eq("status", "Active");

        if (search.trim()) {
          request = request.or(
            `name.ilike.%${search}%,builder.ilike.%${search}%,category.ilike.%${search}%`
          );
        }
        return await request.order("likes", { ascending: false }).abortSignal(abortController.current.signal);
      })(),
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: { likes: [], bookmarks: [] } };

        const [likes, bookmarks] = await Promise.all([
          supabase.from("Likes").select("project_id").eq("user_id", user.id),
          supabase.from("Bookmarks").select("project_id").eq("user_id", user.id)
        ]);

        return { data: { 
          likes: likes.data?.map(l => l.project_id) || [], 
          bookmarks: bookmarks.data?.map(b => b.project_id) || [] 
        }};
      })()
    ]);

    console.timeEnd("SEARCH_REQUEST");

    if (projectsRes.error) {
      if (projectsRes.error.name !== 'AbortError') {
        console.error(projectsRes.error);
        setError("Failed to search projects. Please try again.");
        setLoading(false);
      }
      return;
    }

    setProjects(projectsRes.data || []);
    setUserInteractions({
      likes: new Set(userRes.data.likes),
      bookmarks: new Set(userRes.data.bookmarks)
    });
    setLoading(false);
  }

  const handleSearchChange = (q) => {
    setQuery(q);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      setSearchParams({ q });
    }, 300);
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
                placeholder="Search by project, builder, or category..."
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl py-6 pl-16 pr-8 text-xl text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
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
                    isLikedInitial={userInteractions.likes.has(project.id)}
                    isBookmarkedInitial={userInteractions.bookmarks.has(project.id)}
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