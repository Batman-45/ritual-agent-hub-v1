import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Users, Flame, Heart, Eye, Boxes, Layers, Star, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import ProjectCard from "../components/ProjectCard";
import LoadingCards from "../components/LoadingCards";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [liveStats, setLiveStats] = useState({ totalProjects: 0, totalLikes: 0, totalViews: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setStatsLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setProjects([]);
      setStatsLoading(false);
    } else {
      setProjects(data || []);

      // Calculate stats
      const totalProjects = data.length;
      const totalLikes = data.reduce((sum, p) => sum + (p.likes || 0), 0);
      const totalViews = data.reduce((sum, p) => sum + (p.views || 0), 0);
      setLiveStats({ totalProjects, totalLikes, totalViews });
      setStatsLoading(false);

      const stats = {};
      (data || []).forEach((project) => {
        const name = project.builder || "Unknown";
        if (!stats[name]) {
          stats[name] = { name, projects: 0, likes: 0, views: 0 };
        }
        stats[name].projects += 1;
        stats[name].likes += project.likes || 0;
        stats[name].views += project.views || 0;
      });

      setBuilders(
        Object.values(stats)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 6)
      );
    }

    setLoading(false);
  }

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        projects
          .map((p) => p.category)
          .filter(Boolean)
      ),
    ];
  }, [projects]);

  const featuredProjects = projects.filter((p) => p.featured);
  
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = search.toLowerCase();

      const matchesSearch =
        project.name?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q) ||
        project.type?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" ||
        project.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory &&
        !project.featured
      );
    });
  }, [projects, search, selectedCategory]);

  const stats = [
    { icon: Boxes, value: statsLoading ? "..." : liveStats.totalProjects, label: "Projects" },
    { icon: Eye, value: statsLoading ? "..." : liveStats.totalViews, label: "Total Views" },
    { icon: Star, value: featuredProjects.length, label: "Top Picks" },
    { icon: Heart, value: statsLoading ? "..." : liveStats.totalLikes, label: "Total Likes" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#09090B] text-white"
    >
      <Navbar />

      <Hero />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={(query) => {
            if (!query.trim()) return;
            console.log("SEARCH SUBMITTED:", query);
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          }}
        />

        <div className="mb-10 mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={[
                "rounded-full px-5 py-2 text-sm font-semibold transition",
                selectedCategory === category
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-emerald-500 hover:text-white",
              ].join(" ")}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition hover:border-emerald-500"
              >
                <Icon size={24} className="mb-3 text-emerald-400" />
                <h2 className="text-4xl font-black text-emerald-400">
                  {stat.value}
                </h2>
                <p className="mt-2 text-zinc-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Categories */}
        <section className="mb-20">
          <h2 className="mb-8 text-3xl font-black sm:text-4xl">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories
              .filter((category) => category !== "All")
              .map((category) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center font-semibold transition hover:border-emerald-400 hover:bg-zinc-800"
                >
                  {category}
                </motion.button>
              ))}
          </div>
        </section>

        {/* Top Builders */}
        <section className="mb-20">
          <div className="mb-8">
            <p className="flex items-center gap-2 font-bold uppercase tracking-widest text-emerald-400">
              <Users size={16} />
              Top Builders
            </p>

            <h2 className="mt-1 text-3xl font-black sm:text-4xl">
              Top Builders
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {builders.map((builder) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={builder.name}
              >
                <Link
                  to={`/builder/${encodeURIComponent(builder.name)}`}
                  className="block h-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-400 hover:bg-zinc-800"
                >
                  <h3 className="text-2xl font-bold">{builder.name}</h3>

                  <p className="mt-2 text-zinc-400">
                    {builder.projects} Project{builder.projects !== 1 ? "s" : ""}
                  </p>

                  <div className="mt-4 flex gap-6 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Heart size={16} className="text-red-400" />
                      {builder.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye size={16} className="text-cyan-400" />
                      {builder.views}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="pb-20">
          {featuredProjects.length > 0 && (
            <>
              <div className="mb-12">
                <p className="flex items-center gap-2 font-bold uppercase tracking-widest text-emerald-400">
                  <Flame size={16} />
                  Trending
                </p>

                <h2 className="mt-1 text-3xl font-black sm:text-5xl">
                  Trending Projects
                </h2>

                <p className="mt-3 max-w-xl text-zinc-400">
                  Most loved projects in the Ritual ecosystem.
                </p>
              </div>

              <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <motion.div
                    whileHover={{ y: -10 }}
                    key={`featured-${project.id}`}
                  >
                    <ProjectCard
                      project={project}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Explore Ritual Ecosystem
            </h2>

            <span className="text-sm text-zinc-500">
              {filteredProjects.length} Project
              {filteredProjects.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <LoadingCards />
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 py-20 text-center">
              <SearchX size={48} className="mx-auto text-zinc-600" />
              <h3 className="mt-6 text-2xl font-bold">No Projects Found</h3>

              <p className="mt-3 text-zinc-500">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <motion.div
                  whileHover={{ y: -10 }}
                  key={project.id}
                >
                  <ProjectCard
                    project={project}
                  />
                </motion.div>
              ))}
            </div>
          )
          }
        </section>
      </div>

      <Footer />
    </motion.div>
  );
}