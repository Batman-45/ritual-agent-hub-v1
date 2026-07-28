import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  ArrowRight,
  Boxes,
  Rocket,
  Cpu,
  Shield,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
  projects: 0,
  builders: 0,
  likes: 0,
  views: 0,
});
  const [featuredProjects, setFeaturedProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

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

    const [{ data: latest }, { data: featured }] = await Promise.all([
      supabase
        .from("Projects")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("Projects")
        .select("*")
        .eq("featured", true)
        .limit(6),
    ]);

    setProjects(latest || []);
setFeaturedProjects(featured || []);

// Calculate statistics
const allProjects = latest || [];

setStats({
  projects: allProjects.length,
  builders: new Set(
    allProjects.map((project) => project.builder)
  ).size,
  likes: allProjects.reduce(
    (sum, project) => sum + (project.likes || 0),
    0
  ),
  views: allProjects.reduce(
    (sum, project) => sum + (project.views || 0),
    0
  ),
});

setLoading(false);
}

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name?.toLowerCase().includes(search.toLowerCase()) ||
        project.builder?.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase()) ||
        project.tags?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || project.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">

        {/* Hero */}

        <section className="relative overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_55%)]" />

          <div className="mx-auto max-w-7xl px-6 py-24">

            <div className="mx-auto max-w-4xl text-center">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">

                <Sparkles size={16} />

                Discover Everything Built on Ritual

              </div>

              <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">

                Ritual

                <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">

                  Ecosystem Directory

                </span>

              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">

                Discover AI projects, autonomous agents, developer tools,
                infrastructure and applications powering the Ritual ecosystem.

              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

                <Link
                  to="/submit"
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4 font-semibold text-black transition hover:scale-105"
                >
                  Submit Project
                </Link>

                <a
                  href="#projects"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-8 py-4 font-semibold transition hover:border-emerald-500"
                >
                  Explore Projects

                  <ArrowRight size={18} />
                </a>

              </div>

            </div>

          </div>

        </section>

        {/* Search */}

        <section className="mx-auto -mt-8 max-w-7xl px-6">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">

            <div className="relative">

              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                placeholder="Search projects, builders or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 py-4 pl-14 pr-5 outline-none transition focus:border-emerald-500"
              />

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
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

          </div>

        </section>
                {/* Featured Projects */}

        <section className="mx-auto mt-20 max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
                <Rocket className="text-emerald-400" />
                Featured Projects
              </h2>

              <p className="mt-2 text-zinc-400">
                Hand-picked projects building on Ritual.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
                />
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <Boxes size={56} className="mx-auto text-zinc-600" />
              <h3 className="mt-6 text-2xl font-bold text-white">
                No Featured Projects
              </h3>
              <p className="mt-2 text-zinc-500">
                Featured projects will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>

        {/* Latest Projects */}

        <section
          id="projects"
          className="mx-auto mt-24 max-w-7xl px-6"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-bold text-white">
                <Cpu className="text-emerald-400" />
                Latest Projects
              </h2>

              <p className="mt-2 text-zinc-400">
                Explore everything built on Ritual.
              </p>
            </div>

            <div className="text-sm text-zinc-500">
              {filteredProjects.length} Projects
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-[420px] animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900"
                />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <Search size={56} className="mx-auto text-zinc-600" />
              <h3 className="mt-6 text-2xl font-bold text-white">
                No Projects Found
              </h3>

              <p className="mt-2 text-zinc-500">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </section>

        {/* Ecosystem Stats */}

        <section className="mx-auto mt-24 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Projects
              </p>

              <h3 className="mt-3 text-4xl font-black">
                {stats.projects}
              </h3>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Builders
              </p>

              <h3 className="mt-3 text-4xl font-black">
                {stats.builders}
              </h3>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Categories
              </p>

              <h3 className="mt-3 text-4xl font-black">
                {
                  new Set(
                    projects.map((p) => p.category)
                  ).size
                }
              </h3>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-wide text-zinc-500">
                Verified
              </p>

              <h3 className="mt-3 flex items-center gap-3 text-4xl font-black">
                <Shield className="text-emerald-400" />

                {
                  projects.filter(
                    (p) => p.verified
                  ).length
                }
              </h3>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}