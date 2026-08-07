import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  FolderGit2,
  Search,
  Plus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function MyProjects() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

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
    const confirmDelete = window.confirm(
      "Delete this project?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("Projects")
      .delete()
      .eq("id", id);

    if (!error) {
      setProjects((prev) =>
        prev.filter((p) => p.id !== id)
      );
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = search.toLowerCase();

      const matchesSearch =
        project.name?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q);

      const matchesCategory =
        category === "All" ||
        project.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">

        {/* Header */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-5xl font-black">
                My Projects
              </h1>

              <p className="mt-3 text-zinc-400">
                Manage all your Ritual ecosystem projects.
              </p>

            </div>

            <Link
              to="/submit"
              className="flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 font-semibold text-black"
            >
              <Plus size={18} />
              Submit Project
            </Link>

          </div>

        </section>

        {/* Search & Filter */}

        <section className="mx-auto max-w-7xl px-6">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
              />

            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 text-white outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
            >
              {categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

        </section>
                {/* Projects */}

        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="mb-8 flex items-center gap-3">

            <FolderGit2 className="text-emerald-400" />

            <h2 className="text-3xl font-bold">
              My Projects ({filteredProjects.length})
            </h2>

          </div>

          {loading ? (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {[1,2,3,4,5,6].map((i)=>(
                <div
                  key={i}
                  className="h-[430px] animate-pulse rounded-3xl bg-zinc-900"
                />
              ))}

            </div>

          ) : filteredProjects.length === 0 ? (

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-16 text-center">

              <FolderGit2
                size={60}
                className="mx-auto mb-6 text-zinc-600"
              />

              <h3 className="text-3xl font-bold">
                No Projects Found
              </h3>

              <p className="mt-4 text-zinc-400">
                Create your first Ritual project.
              </p>

              <Link
                to="/submit"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 font-semibold text-black"
              >
                <Plus size={18} />
                Submit Project
              </Link>

            </div>

          ) : (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {filteredProjects.map((project) => (

                <ProjectCard
  key={project.id}
  project={project}
  onEdit={() => navigate(`/edit/${project.id}`)}
  onDelete={() => deleteProject(project.id)}
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