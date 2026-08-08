import { useEffect, useState } from "react";
import { Shield, Loader2, FolderGit2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*");

    if (error) {
      console.error(error);
    }

    setProjects(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading admin panel...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 flex items-center gap-3 text-4xl font-black sm:text-5xl">
            <Shield size={40} className="text-emerald-400" />
            Admin Panel
          </h1>

          <p className="mb-8 text-zinc-400">
            Manage all projects in the Ritual ecosystem.
          </p>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <FolderGit2 size={48} className="mx-auto text-zinc-600" />
              <p className="mt-6 text-2xl font-bold text-zinc-300">
                No projects found
              </p>
              <p className="mt-3 text-zinc-500">
                Projects will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                console.log("Admin rendering project:", project.name);
                return (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">{project.name}</h2>
                      <Link
                        to={`/edit/${project.id}`}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
                      >
                        Edit
                      </Link>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-400">
                      <span>{project.builder}</span>
                      <span className="text-zinc-600">•</span>
                      <span>{project.category}</span>
                      <span className="text-zinc-600">•</span>
                      <span>{project.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}