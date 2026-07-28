import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Eye,
  Heart,
  Search,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function MyDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setProjects(data || []);
    }

    setLoading(false);
  }

  async function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;

    const { error } = await supabase
      .from("Projects")
      .delete()
      .eq("id", id);

    if (!error) {
      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const totalViews = projects.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  const totalLikes = projects.reduce(
    (sum, p) => sum + (p.likes || 0),
    0
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">
        <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h1 className="text-5xl font-black">
              My Dashboard
            </h1>

            <p className="mt-4 text-lg text-zinc-400">
              Welcome back{user?.email ? `, ${user.email}` : ""}.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <FolderOpen className="text-emerald-400" size={32} />
              <h2 className="mt-4 text-4xl font-bold">
                {projects.length}
              </h2>
              <p className="text-zinc-400">Projects</p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <Eye className="text-cyan-400" size={32} />
              <h2 className="mt-4 text-4xl font-bold">
                {totalViews}
              </h2>
              <p className="text-zinc-400">Views</p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <Heart className="text-red-400" size={32} />
              <h2 className="mt-4 text-4xl font-bold">
                {totalLikes}
              </h2>
              <p className="text-zinc-400">Likes</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 outline-none"
              />
            </div>

            <Link
              to="/submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black"
            >
              <Plus size={18} />
              Submit Project
            </Link>
          </div>

          {loading ? (
            <p className="mt-10 text-zinc-400">Loading...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="mt-10 text-zinc-400">
              No projects found.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  <h3 className="text-xl font-bold">
                    {project.name}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    {project.description}
                  </p>

                  <div className="mt-4 flex justify-between text-sm text-zinc-400">
                    <span>👁 {project.views || 0}</span>
                    <span>❤️ {project.likes || 0}</span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <Link
                      to={`/project/${project.id}`}
                      className="rounded-lg bg-emerald-500 py-2 text-center font-semibold text-black"
                    >
                      View
                    </Link>

                    <Link
                      to={`/edit-project/${project.id}`}
                      className="flex items-center justify-center rounded-lg bg-zinc-800"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="flex items-center justify-center rounded-lg bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}