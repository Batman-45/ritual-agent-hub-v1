import AnalyticsChart from "../components/AnalyticsChart";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  CheckCircle,
  Clock,
  Star,
  Trash2,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setProjects(data || []);
    }

    setLoading(false);
  }

  async function approveProject(id) {
    const { error } = await supabase
      .from("Projects")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) return toast.error(error.message);

    toast.success("Project Approved");
    loadProjects();
  }

  async function toggleFeatured(project) {
    const { error } = await supabase
      .from("Projects")
      .update({
        featured: !project.featured,
      })
      .eq("id", project.id);

    if (error) return toast.error(error.message);

    toast.success("Updated");
    loadProjects();
  }

  async function toggleVerified(project) {
    const { error } = await supabase
      .from("Projects")
      .update({
        verified: !project.verified,
      })
      .eq("id", project.id);

    if (error) return toast.error(error.message);

    toast.success("Updated");
    loadProjects();
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;

    const { error } = await supabase
      .from("Projects")
      .delete()
      .eq("id", id);

    if (error) return toast.error(error.message);

    toast.success("Project Deleted");
    loadProjects();
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = search.toLowerCase();

      const matchesSearch =
        project.name?.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q) ||
        project.builder?.toLowerCase().includes(q);

      const matchesFilter =
        filter === "all"
          ? true
          : project.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  const stats = {
  totalProjects: projects.length,

  totalViews: projects.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  ),

  totalLikes: projects.reduce(
    (sum, p) => sum + (p.likes || 0),
    0
  ),

  pending: projects.filter(
    (p) => p.status !== "approved"
  ).length,

  approved: projects.filter(
    (p) => p.status === "approved"
  ).length,

  featured: projects.filter(
    (p) => p.featured
  ).length,
};

  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-14">

        <div className="mb-10">
          <h1 className="text-5xl font-black">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-zinc-400">
            Manage Ritual ecosystem submissions.
          </p>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <StatCard
    title="📁 Projects"
    value={stats.totalProjects}
  />

  <StatCard
    title="❤️ Likes"
    value={stats.totalLikes}
  />

  <StatCard
    title="👀 Views"
    value={stats.totalViews}
  />

  <StatCard
    title="⏳ Pending"
    value={stats.pending}
  />

</div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pl-12 pr-4 outline-none focus:border-emerald-400"
            />

          </div>

          <select
            value={filter}
            onChange={(e)=>setFilter(e.target.value)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

        </div>
                {loading ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            Loading projects...
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

            <table className="w-full">

              <thead className="border-b border-zinc-800 bg-zinc-950/60">
                <tr>
                  <th className="px-6 py-4 text-left">Project</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Views</th>
                  <th className="px-6 py-4 text-left">Likes</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-zinc-500"
                    >
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/40"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          {project.logo ? (
                            <img
                              src={project.logo}
                              alt={project.name}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 font-bold">
                              {project.name?.charAt(0)}
                            </div>
                          )}

                          <div>

                            <div className="font-bold">
                              {project.name}
                            </div>

                            <div className="text-sm text-zinc-500">
                              {project.category || "Uncategorized"}
                            </div>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            project.status === "approved"
                              ? "bg-emerald-500 text-black"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          {project.status}
                        </span>

                      </td>

                      <td className="px-6 py-5">
  👀 {project.views || 0}
</td>

<td className="px-6 py-5">
  ❤️ {project.likes || 0}
</td>

                      <td className="px-6 py-5">

                        <div className="flex flex-wrap gap-2">

                          {project.status !== "approved" && (
                            <button
                              onClick={() => approveProject(project.id)}
                              className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-black"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => toggleFeatured(project)}
                            className={`rounded-lg px-3 py-2 ${
                              project.featured
                                ? "bg-yellow-500 text-black"
                                : "bg-zinc-800"
                            }`}
                          >
                            <Star size={16} />
                          </button>

                          <button
                            onClick={() => toggleVerified(project)}
                            className={`rounded-lg px-3 py-2 ${
                              project.verified
                                ? "bg-blue-500"
                                : "bg-zinc-800"
                            }`}
                          >
                            <ShieldCheck size={16} />
                          </button>

                          <button
                            onClick={() => deleteProject(project.id)}
                            className="rounded-lg bg-red-500 px-3 py-2"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        )}

      </main>

      <Footer />

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-black">
        {value}
      </h2>

    </div>
  );
}