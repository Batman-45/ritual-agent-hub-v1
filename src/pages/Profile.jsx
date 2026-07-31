import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  FolderGit2,
  Heart,
  Eye,
  Star,
  Plus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    const { data } = await supabase
      .from("Projects")
      .select("*")
      .eq("owner_id", user.id);

    setProjects(data || []);
    setLoading(false);
  }

  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  const totalLikes = projects.reduce(
    (sum, p) => sum + (p.likes || 0),
    0
  );

  const totalViews = projects.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  const featuredProjects = projects.filter(
    (p) => p.featured
  ).length;

  const avatar =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.email || "User"
    )}&background=10b981&color=fff`;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">

        {/* Hero */}

        <section className="mx-auto max-w-6xl px-6 py-16">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

            <div className="flex flex-col items-center gap-8 lg:flex-row">

              <img
                src={avatar}
                alt="Avatar"
                className="h-36 w-36 rounded-full border-4 border-emerald-500 object-cover"
              />

              <div className="flex-1">

                <h1 className="text-5xl font-black">
  {user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name ||
    user?.email?.split("@")[0]}
</h1>

<div className="mt-3 flex flex-wrap items-center gap-3">

  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
    <Star size={16} />
    Verified Builder
  </div>

  {user?.user_metadata?.user_name && (
    <a
      href={`https://github.com/${user.user_metadata.user_name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-400 hover:underline"
    >
      GitHub Profile →
    </a>
  )}

</div>

                <div className="mt-6 space-y-3 text-zinc-400">

                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    {user?.email}
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>

                </div>

                <div className="mt-8 flex flex-wrap gap-4">

                  <Link
                    to="/submit"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 font-semibold text-black"
                  >
                    <Plus size={18} />
                    Submit Project
                  </Link>

                  <Link
                    to="/dashboard"
                    className="rounded-xl border border-zinc-700 px-6 py-3 hover:border-emerald-500"
                  >
                    Dashboard
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Stats */}

        <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <FolderGit2 className="mb-4 text-emerald-400" />
            <h2 className="text-4xl font-black">
              {projects.length}
            </h2>
            <p className="text-zinc-400">
              Projects
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <Heart className="mb-4 text-red-400" />
            <h2 className="text-4xl font-black">
              {totalLikes}
            </h2>
            <p className="text-zinc-400">
              Likes
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <Eye className="mb-4 text-cyan-400" />
            <h2 className="text-4xl font-black">
              {totalViews}
            </h2>
            <p className="text-zinc-400">
              Views
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <Star className="mb-4 text-yellow-400" />
            <h2 className="text-4xl font-black">
              {featuredProjects}
            </h2>
            <p className="text-zinc-400">
              Featured
            </p>
          </div>

        </section>
                {/* My Projects */}

        <section className="mx-auto max-w-6xl px-6 py-12">

          <div className="mb-8 flex items-center justify-between">

            <h2 className="text-3xl font-bold">
              My Projects
            </h2>

            <Link
              to="/my-projects"
              className="rounded-xl border border-zinc-700 px-5 py-3 hover:border-emerald-500"
            >
              View All
            </Link>

          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-800">

            <table className="w-full">

              <thead className="bg-zinc-900">

                <tr>
                  <th className="p-4 text-left">Project</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Views</th>
                  <th className="p-4 text-left">Likes</th>
                </tr>

              </thead>

              <tbody>

                {projects.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="p-10 text-center text-zinc-500"
                    >
                      No projects found.
                    </td>

                  </tr>

                ) : (

                  projects.slice(0, 5).map((project) => (

                    <tr
                      key={project.id}
                      className="border-t border-zinc-800 hover:bg-zinc-900/50"
                    >

                      <td className="p-4 font-medium text-white">
                        <Link
  to={`/project/${project.id}`}
  className="text-emerald-400 hover:underline"
>
  {project.name}
</Link>
                      </td>

                      <td className="p-4 text-zinc-300">
                        {project.category}
                      </td>

                      <td className="p-4 text-zinc-300">
                        {project.views || 0}
                      </td>

                      <td className="p-4 text-zinc-300">
                        {project.likes || 0}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* Account Information */}

        <section className="mx-auto max-w-6xl px-6 pb-24">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

            <div className="mb-6 flex items-center gap-3">

              <User className="text-emerald-400" />

              <h2 className="text-3xl font-bold">
                Account Information
              </h2>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <p className="mb-2 text-sm text-zinc-500">
                  Username
                </p>

                <p className="text-lg text-white">
                  {user?.user_metadata?.user_name ||
                    user?.email?.split("@")[0]}
                </p>

              </div>

              <div>

                <p className="mb-2 text-sm text-zinc-500">
                  Email
                </p>

                <p className="text-lg text-white">
                  {user?.email}
                </p>

              </div>

              <div>

                <p className="mb-2 text-sm text-zinc-500">
                  Authentication
                </p>

                <p className="text-lg text-white">
                  GitHub OAuth
                </p>

              </div>

              <div>

                <p className="mb-2 text-sm text-zinc-500">
                  Total Projects
                </p>

                <p className="text-lg text-white">
                  {projects.length}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}