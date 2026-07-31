import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  FolderGit2,
  Eye,
  Heart,
  Plus,
  Star,
  CheckCircle2,
  Activity,
  TrendingUp,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
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

  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = projects.reduce((sum, p) => sum + (p.likes || 0), 0);
  const featuredCount = projects.filter((p) => p.featured).length;
  const verifiedCount = projects.filter((p) => p.verified).length;
  const recentProjects = projects.slice(0, 5);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">

        {/* Hero */}

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h1 className="text-5xl font-black">
                Dashboard
              </h1>

              <p className="mt-3 text-zinc-400">
                Welcome back,
                {" "}
                {user?.user_metadata?.user_name || user?.email}
              </p>

            </div>

            <Link
              to="/submit"
              className="flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 font-semibold text-black transition hover:scale-105"
            >
              <Plus size={18} />
              Submit Project
            </Link>

          </div>

        </section>

        {/* Analytics */}

        <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <FolderGit2 className="mb-4 text-emerald-400" />
            <h2 className="text-4xl font-black">{projects.length}</h2>
            <p className="mt-2 text-zinc-400">Projects</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <Eye className="mb-4 text-cyan-400" />
            <h2 className="text-4xl font-black">{totalViews}</h2>
            <p className="mt-2 text-zinc-400">Views</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <Heart className="mb-4 text-red-400" />
            <h2 className="text-4xl font-black">{totalLikes}</h2>
            <p className="mt-2 text-zinc-400">Likes</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <Star className="mb-4 text-yellow-400" />
            <h2 className="text-4xl font-black">{featuredCount}</h2>
            <p className="mt-2 text-zinc-400">Featured</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <CheckCircle2 className="mb-4 text-emerald-400" />
            <h2 className="text-4xl font-black">{verifiedCount}</h2>
            <p className="mt-2 text-zinc-400">Verified</p>
          </div>

        </section>
                {/* Recent Activity */}

        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="mb-8 flex items-center gap-3">

            <Activity className="text-emerald-400" />

            <h2 className="text-3xl font-bold">
              Recent Activity
            </h2>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

            {recentProjects.length === 0 ? (

              <p className="text-zinc-400">
                You haven't submitted any projects yet.
              </p>

            ) : (

              <div className="space-y-5">

                {recentProjects.map((project) => (

                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b border-zinc-800 pb-4"
                  >

                    <div>

                      <h3 className="font-semibold text-white">
                        {project.name}
                      </h3>

                      <p className="text-sm text-zinc-400">
                        {project.category}
                      </p>

                    </div>

                    <div className="flex items-center gap-4 text-sm text-zinc-400">

                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {project.views || 0}
                      </span>

                      <span className="flex items-center gap-1">
                        <Heart size={16} />
                        {project.likes || 0}
                      </span>

                      <TrendingUp className="text-emerald-400" />

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* Projects Table */}

        <section className="mx-auto max-w-7xl px-6 pb-24">

          <div className="mb-8 flex items-center justify-between">

            <h2 className="text-3xl font-bold">
              My Projects
            </h2>

            <Link
              to="/submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black"
            >
              <Plus size={18} />
              New Project
            </Link>

          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-800">

            <table className="w-full">

              <thead className="bg-zinc-900">

                <tr>

                  <th className="p-4 text-left">Project</th>
                  <th className="p-4 text-left">Views</th>
                  <th className="p-4 text-left">Likes</th>
                  <th className="p-4 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {projects.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="p-10 text-center text-zinc-500"
                    >
                      No projects yet.
                    </td>

                  </tr>

                ) : (

                  projects.map((project) => (

                    <tr
                      key={project.id}
                      className="border-t border-zinc-800 hover:bg-zinc-900/50"
                    >

                      <td className="p-4 font-medium text-white">
                        {project.name}
                      </td>

                      <td className="p-4 text-zinc-300">
                        {project.views || 0}
                      </td>

                      <td className="p-4 text-zinc-300">
                        {project.likes || 0}
                      </td>

                      <td className="p-4">

                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                          {project.status || "Active"}
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}