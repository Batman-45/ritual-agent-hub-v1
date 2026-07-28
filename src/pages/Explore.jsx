import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Grid3X3,
  List,
  ArrowDownAZ,
  Flame,
  Eye,
  Clock3,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("latest");

  const [view, setView] = useState("grid");

  const [visible, setVisible] = useState(9);

  const categories = [
    "All",
    "AI",
    "Agent",
    "Infrastructure",
    "Developer Tools",
    "Gaming",
    "DeFi",
    "Security",
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*");

    if (!error) {
      setProjects(data || []);
    }

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
    return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">

        {/* Hero */}

        <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-500/10 to-transparent">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <h1 className="text-5xl font-black text-white">
              Explore Projects
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Browse every project built in the Ritual ecosystem.
            </p>

          </div>

        </section>

        {/* Search & Filters */}

        <section className="mx-auto max-w-7xl px-6 py-10">

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
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 py-4 pl-12 pr-4 outline-none transition focus:border-emerald-500"
                />

              </div>

              {/* Sort */}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 outline-none focus:border-emerald-500"
              >
                <option value="latest">Latest</option>
                <option value="likes">Most Liked</option>
                <option value="views">Most Viewed</option>
                <option value="name">A-Z</option>
              </select>

            </div>

            {/* Categories */}

            <div className="mt-6 flex flex-wrap gap-3">

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    setVisible(9);
                  }}
                  className={`rounded-full px-5 py-2 text-sm transition ${
                    category === item
                      ? "bg-emerald-500 text-black"
                      : "border border-zinc-800 bg-zinc-900 hover:border-emerald-500"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

            {/* Toolbar */}

            <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-6 md:flex-row md:items-center md:justify-between">

              <p className="text-zinc-400">
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
                  className={`rounded-xl p-3 transition ${
                    view === "grid"
                      ? "bg-emerald-500 text-black"
                      : "border border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>

                <button
                  onClick={() => setView("list")}
                  className={`rounded-xl p-3 transition ${
                    view === "list"
                      ? "bg-emerald-500 text-black"
                      : "border border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <List size={18} />
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* Projects */}

        <section className="mx-auto max-w-7xl px-6 pb-20">

          {loading ? (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
                />
              ))}

            </div>

          ) : filteredProjects.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">

              <Search
                size={56}
                className="mx-auto text-zinc-600"
              />

              <h2 className="mt-6 text-3xl font-bold">
                No Projects Found
              </h2>

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
            filteredProjects.length > visible && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisible((prev) => prev + 9)}
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
