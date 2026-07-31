import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  Boxes,
  Users,
  Heart,
  Eye,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [latestProjects, setLatestProjects] = useState([]);

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
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      const list = data || [];

      setProjects(list);

      setFeaturedProjects(
        list.filter((p) => p.featured).slice(0, 3)
      );

      setTrendingProjects(
        [...list]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 6)
      );

      setLatestProjects(
        [...list]
          .sort(
            (a, b) =>
              new Date(b.created_at) -
              new Date(a.created_at)
          )
          .slice(0, 6)
      );
    }

    setLoading(false);
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = search.toLowerCase();

      const matchesSearch =
        project.name?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.builder?.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q);

      const matchesCategory =
        category === "All" ||
        project.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  const stats = {
    projects: projects.length,
    builders: new Set(
      projects.map((p) => p.builder).filter(Boolean)
    ).size,

    likes: projects.reduce(
      (sum, p) => sum + (p.likes || 0),
      0
    ),

    views: projects.reduce(
      (sum, p) => sum + (p.views || 0),
      0
    ),
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">
        {/* Hero Section */}

<section className="relative overflow-hidden border-b border-zinc-800">

  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

  <div className="relative mx-auto max-w-7xl px-6 py-24">

    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
      <Sparkles size={16} />
      Ritual Ecosystem Directory
    </span>

    <h1 className="mt-8 max-w-5xl text-6xl font-black leading-tight">
      Discover the next generation of
      <span className="text-emerald-400"> AI Agents</span>
      <br />
      built on Ritual.
    </h1>

    <p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-400">
      Explore AI agents, infrastructure, developer tools and
      community projects built on Ritual.
    </p>

    <div className="relative mt-10 max-w-2xl">

      <Search
        size={22}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects..."
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-5 pl-14 pr-5 outline-none focus:border-emerald-500"
      />

    </div>

    <div className="mt-14 grid gap-6 md:grid-cols-4">

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
        <Boxes className="mb-4 text-emerald-400" />
        <h2 className="text-4xl font-black">{stats.projects}</h2>
        <p className="mt-2 text-zinc-400">Projects</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
        <Users className="mb-4 text-emerald-400" />
        <h2 className="text-4xl font-black">{stats.builders}</h2>
        <p className="mt-2 text-zinc-400">Builders</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
        <Heart className="mb-4 text-emerald-400" />
        <h2 className="text-4xl font-black">{stats.likes}</h2>
        <p className="mt-2 text-zinc-400">Likes</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
        <Eye className="mb-4 text-emerald-400" />
        <h2 className="text-4xl font-black">{stats.views}</h2>
        <p className="mt-2 text-zinc-400">Views</p>
      </div>

    </div>

  </div>

</section>

{/* Featured Projects */}

<section className="mx-auto max-w-7xl px-6 py-20">

  <div className="mb-10">
    <h2 className="text-4xl font-black">⭐ Featured Projects</h2>
    <p className="mt-2 text-zinc-400">
      Highlighted projects from the Ritual ecosystem
    </p>
  </div>

  <div className="grid gap-8 lg:grid-cols-3">
    {featuredProjects.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
      />
    ))}
  </div>

</section>

{/* Trending Projects */}

<section className="mx-auto max-w-7xl px-6 pb-20">

  <div className="mb-10">
    <h2 className="text-4xl font-black">🔥 Trending Projects</h2>
    <p className="mt-2 text-zinc-400">
      Most viewed projects
    </p>
  </div>

  <div className="grid gap-8 lg:grid-cols-3">
    {trendingProjects.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
      />
    ))}
  </div>

</section>

{/* Latest Projects */}

<section className="mx-auto max-w-7xl px-6 pb-20">

  <div className="mb-10">
    <h2 className="text-4xl font-black">🆕 Latest Projects</h2>
    <p className="mt-2 text-zinc-400">
      Recently submitted projects
    </p>
  </div>

  <div className="grid gap-8 lg:grid-cols-3">
    {latestProjects.map((project) => (
      <ProjectCard
        key={project.id}
        project={project}
      />
    ))}
  </div>

</section>
{/* Categories */}

<section className="mx-auto max-w-7xl px-6">

  <div className="mb-10 flex flex-wrap gap-3">

    {categories.map((item) => (
      <button
        key={item}
        onClick={() => setCategory(item)}
        className={`rounded-full px-5 py-3 transition ${
          category === item
            ? "bg-emerald-500 font-semibold text-black"
            : "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-emerald-500"
        }`}
      >
        {item}
      </button>
    ))}

  </div>

</section>

{/* Explore Projects */}

<section className="mx-auto max-w-7xl px-6 pb-24">

  <div className="mb-10">

    <h2 className="text-4xl font-black">
      Explore Projects
    </h2>

    <p className="mt-2 text-zinc-400">
      Browse every project built on Ritual.
    </p>

  </div>

  {loading ? (

    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-[430px] animate-pulse rounded-3xl bg-zinc-900"
        />
      ))}

    </div>

  ) : filteredProjects.length === 0 ? (

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-16 text-center">

      <h3 className="text-3xl font-bold">
        No projects found
      </h3>

      <p className="mt-4 text-zinc-400">
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

</main>

<Footer />

</>
);
}