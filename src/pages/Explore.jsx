import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  Flame,
  Eye,
  Clock3,
  ArrowDownAZ,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("latest");

  const [view, setView] = useState("grid");

  const [visible, setVisible] = useState(20);

  const categoryCounts = useMemo(() => {
    const counts = { All: projects.length };
    projects.forEach((p) => {
      const cat = p.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const categories = useMemo(() => {
    return Object.keys(categoryCounts).sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    });
  }, [categoryCounts]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Projects")
      .select("*");

    if (error) {
      console.error(error);
      setError("Failed to load projects. Please try again.");
      setLoading(false);
      return;
    }

    setProjects(data || []);
    setLoading(false);
  }

  const filteredProjects = useMemo(() => {
    let data = [...projects];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter((project) => {
        return (
          project.name?.toLowerCase().includes(keyword) ||
          project.builder?.toLowerCase().includes(keyword) ||
          project.description?.toLowerCase().includes(keyword) ||
          project.category?.toLowerCase().includes(keyword) ||
          project.tags?.toLowerCase().includes(keyword)
        );
      });
    }

    if (category !== "All") {
      data = data.filter(
        (project) => project.category === category
      );
    }

    switch (sortBy) {
      case "likes":
        data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;

      case "views":
        data.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;

      case "name":
        data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        data.sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        );
    }

    return data;
  }, [projects, search, category, sortBy]);

  const sortIcons = {
    latest: <Clock3 size={16} />,
    likes: <Flame size={16} />,
    views: <Eye size={16} />,
    name: <ArrowDownAZ size={16} />,
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">
        {/* Hero */}
        <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <h1 className="text-4xl font-black text-white sm:text-5xl">
              Explore Projects
            </h1>

            <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
              Browse every project built in the Ritual ecosystem.
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                />
              </div>

              {/* Sort */}
              <label className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  {sortIcons[sortBy]}
                </span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-zinc-800 bg-zinc-950 py-4 pl-11 pr-4 text-white outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                >
                  <option value="latest">Latest</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                  <option value="name">A-Z</option>
                </select>
              </label>
            </div>

            {/* Categories */}
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    setVisible(20);
                  }}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    category === item
                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-emerald-500 hover:text-white"
                  }`}
                >
                  {item} ({categoryCounts[item]})
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {Math.min(visible, filteredProjects.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {filteredProjects.length}
                </span>{" "}
                projects
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`rounded-xl p-3 transition ${
                    view === "grid"
                      ? "bg-emerald-500 text-black"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>

                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`rounded-xl p-3 transition ${
                    view === "list"
                      ? "bg-emerald-500 text-black"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <Search size={56} className="mx-auto text-zinc-600" />

              <h2 className="mt-6 text-3xl font-bold">Something went wrong</h2>

              <p className="mt-3 text-zinc-500">{error}</p>

              <button
                onClick={loadProjects}
                className="mt-8 rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-black transition hover:bg-emerald-400"
              >
                Try Again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <Search size={56} className="mx-auto text-zinc-600" />

              <h2 className="mt-6 text-3xl font-bold">No Projects Found</h2>

              <p className="mt-3 text-zinc-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid gap-8 md:grid-cols-2 xl:grid-cols-3"
                  : "space-y-8"
              }
            >
              {filteredProjects
                .slice(0, visible)
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
            </div>
          )}

          {/* Load More */}
          {!loading &&
            !error &&
            filteredProjects.length > visible && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisible((prev) => prev + 20)}
                  className="rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-black transition hover:bg-emerald-400"
                >
                  Load More
                </button>
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}