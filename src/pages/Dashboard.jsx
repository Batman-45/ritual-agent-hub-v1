import { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FolderOpen,
  Eye,
  Heart,
} from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

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
      console.log(error);
      setLoading(false);
      return;
    }

    const allProjects = data || [];

    setProjects(allProjects);

    setStats({
      total: allProjects.length,
      pending: allProjects.filter(
        (p) => p.status === "pending"
      ).length,
      approved: allProjects.filter(
        (p) => p.status === "approved"
      ).length,
      rejected: allProjects.filter(
        (p) => p.status === "rejected"
      ).length,
    });

    setLoading(false);
  }

  async function approveProject(id) {
    await supabase
      .from("Projects")
      .update({ status: "approved" })
      .eq("id", id);

    loadProjects();
  }

  async function rejectProject(id) {
    await supabase
      .from("Projects")
      .update({ status: "rejected" })
      .eq("id", id);

    loadProjects();
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="mx-auto max-w-7xl p-8">

        <h1 className="mb-10 text-5xl font-black">
          Admin Dashboard
        </h1>

        {/* Stats */}

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <FolderOpen className="text-emerald-400" />
            <h2 className="mt-4 text-4xl font-bold">
              {stats.total}
            </h2>
            <p className="text-zinc-400">
              Total Projects
            </p>
          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">
            <Clock className="text-yellow-400" />
            <h2 className="mt-4 text-4xl font-bold">
              {stats.pending}
            </h2>
            <p className="text-zinc-400">
              Pending
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-zinc-900 p-6">
            <CheckCircle className="text-emerald-400" />
            <h2 className="mt-4 text-4xl font-bold">
              {stats.approved}
            </h2>
            <p className="text-zinc-400">
              Approved
            </p>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-zinc-900 p-6">
            <XCircle className="text-red-400" />
            <h2 className="mt-4 text-4xl font-bold">
              {stats.rejected}
            </h2>
            <p className="text-zinc-400">
              Rejected
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="relative mb-10">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pl-14 pr-5 outline-none focus:border-emerald-500"
          />

        </div>

        {/* Projects */}

        {loading ? (
          <p>Loading...</p>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-16 text-center">
            No projects found.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((project) => (

              <div
                key={project.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500"
              >

                <div className="flex items-center gap-4">

                  {project.logo ? (
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-black">
                      {project.name?.charAt(0)}
                    </div>
                  )}

                  <div>

                    <h2 className="text-xl font-bold">
                      {project.name}
                    </h2>

                    <p className="text-sm text-zinc-500">
                      {project.category}
                    </p>

                  </div>

                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-7 text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-5 flex gap-5 text-sm text-zinc-400">

                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {project.views || 0}
                  </span>

                  <span className="flex items-center gap-1">
                    <Heart size={16} />
                    {project.likes || 0}
                  </span>

                </div>

                <div className="mt-5">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      project.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : project.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {project.status}
                  </span>

                </div>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() => approveProject(project.id)}
                    className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectProject(project.id)}
                    className="flex-1 rounded-xl bg-red-500 py-3 font-semibold hover:bg-red-400"
                  >
                    Reject
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}