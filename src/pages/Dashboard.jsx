import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Boxes,
  Heart,
  Eye,
  Bookmark,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  LayoutGrid,
} from "lucide-react";

import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    likes: 0,
    views: 0,
    bookmarks: 0,
  });

  const [allProjects, setAllProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  async function loadAdminDashboard() {
    setLoading(true);

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setLoading(false);
      return;
    }
    setUser(currentUser);

    // Load ALL projects for admin view
    const { data: projectData } = await supabase
      .from("Projects")
      .select("*")
      .order("created_at", { ascending: false });

    // Load ALL bookmarks
    const { data: bookmarks } = await supabase
      .from("Bookmarks")
      .select("*");

    const projects = projectData || [];
    setAllProjects(projects);

    setStats({
      projects: projects.length,
      likes: projects.reduce((sum, p) => sum + (p.likes || 0), 0),
      views: projects.reduce((sum, p) => sum + (p.views || 0), 0),
      bookmarks: (bookmarks || []).length,
    });

    setLoading(false);
  }

  async function deleteProject(id) {
    if (!window.confirm("Delete this project from the ecosystem?")) return;

    const { error } = await supabase
      .from("Projects")
      .delete()
      .eq("id", id);

    if (!error) {
      toast.success("Project deleted.");
      loadAdminDashboard();
    } else {
      toast.error(error.message);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading Admin CMS...</p>
          </div>
        </main>
      </>
    );
  }

  const statCards = [
    { icon: Boxes, value: stats.projects, label: "Total Projects", color: "text-emerald-400" },
    { icon: Heart, value: stats.likes, label: "Total Likes", color: "text-pink-400" },
    { icon: Eye, value: stats.views, label: "Total Views", color: "text-cyan-400" },
    { icon: Bookmark, value: stats.bookmarks, label: "Total Bookmarks", color: "text-yellow-400" },
  ];

  return (
    <>
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full bg-[#09090B] px-4 py-12 text-white sm:px-6"
      >
        <div className="mx-auto max-w-7xl">
          {/* Admin Hero */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">
                Admin CMS
              </h1>
              <p className="mt-3 text-zinc-400">Manage the Ritual ecosystem projects.</p>
            </div>
            <Link
              to="/submit"
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-black transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <Plus size={18} />
              Add Project
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4 mb-12">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl transition hover:border-emerald-500/50"
              >
                <stat.icon size={24} className={`mb-4 ${stat.color}`} />
                <h2 className="text-4xl font-black">{stat.value}</h2>
                <p className="text-zinc-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CMS Projects Management */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <LayoutGrid size={28} className="text-emerald-400"/>
                    Manage Projects
                </h2>
            </div>

            {allProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-700 py-16 text-center">
                <Boxes size={48} className="mx-auto text-zinc-600" />
                <p className="mt-6 text-lg text-zinc-400">
                  No projects found in the ecosystem.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-800/40 p-5 transition hover:border-emerald-500/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-zinc-700 flex items-center justify-center font-bold text-emerald-400">
                            {project.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <p className="text-zinc-500 text-sm">Builder: {project.builder || 'N/A'} | Category: {project.category}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/project/${project.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-semibold hover:bg-zinc-700 transition"
                      >
                        <ExternalLink size={14} />
                        View
                      </Link>

                      <Link
                        to={`/project/${project.id}/edit`}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 px-3 py-2 text-sm font-semibold hover:bg-emerald-500 hover:text-black transition"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteProject(project.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/10 text-red-400 px-3 py-2 text-sm font-semibold hover:bg-red-500 hover:text-white transition"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </>
  );
}
