import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Boxes, Heart, Eye, Loader2, FolderGit2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function BuilderProfile() {
  const { builder } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBuilderProjects() {
      setLoading(true);

      const { data } = await supabase
        .from("Projects")
        .select("*")
        .eq("builder", decodeURIComponent(builder))
        .eq("status", "Active");

      setProjects(data || []);
      setLoading(false);
    }
    loadBuilderProjects();
  }, [builder]);

  const totalLikes = projects.reduce(
    (sum, p) => sum + (p.likes || 0),
    0
  );

  const totalViews = projects.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading builder...</p>
          </div>
        </main>
      </>
    );
  }

  const stats = [
    { icon: Boxes, value: projects.length, label: "Projects" },
    { icon: Heart, value: totalLikes, label: "Likes" },
    { icon: Eye, value: totalViews, label: "Views" },
  ];

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
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl sm:p-10"
          >
            <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-16 -mt-16" />
            
            <h1 className="flex items-center gap-3 text-4xl font-black sm:text-5xl">
              <User size={36} className="text-emerald-400" />
              {builder}
            </h1>

            <p className="mt-3 text-emerald-400 font-semibold tracking-wide uppercase text-sm">
              Ritual Builder
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={stat.label}
                    className="rounded-2xl border border-zinc-800 bg-zinc-800/50 p-6 transition hover:border-emerald-500"
                  >
                    <Icon size={24} className="mb-3 text-emerald-400" />
                    <p className="text-4xl font-black text-white">{stat.value}</p>
                    <p className="text-zinc-400 mt-1">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 mb-8 flex items-center gap-2 text-3xl font-black sm:text-4xl"
          >
            <FolderGit2 size={28} className="text-emerald-400" />
            Builder Projects
          </motion.h2>

          {projects.length === 0 ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center"
            >
              <FolderGit2 size={48} className="mx-auto text-zinc-600" />
              <p className="mt-6 text-2xl font-bold text-zinc-300">
                No projects yet
              </p>
              <p className="mt-3 text-zinc-500">
                This builder hasn't submitted any projects yet.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
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
        </div>
      </motion.main>

      <Footer />
    </>
  );
}