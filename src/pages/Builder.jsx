```jsx
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  FolderGit2,
  Eye,
  Heart,
  User,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function Builder() {
  const { name } = useParams();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [builder, setBuilder] = useState("");

  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
  });

  useEffect(() => {
    loadBuilder();
  }, [name]);

  async function loadBuilder() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .ilike("builder", decodeURIComponent(name));

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const list = data || [];

    setProjects(list);

    if (list.length > 0) {
      setBuilder(list[0].builder);
    }

    setStats({
      views: list.reduce(
        (sum, project) => sum + (project.views || 0),
        0
      ),
      likes: list.reduce(
        (sum, project) => sum + (project.likes || 0),
        0
      ),
    });

    setLoading(false);
  }

  if (!loading && projects.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">

        <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-500/10 to-transparent">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="flex items-center gap-6">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-black">
                <User size={36} />
              </div>

              <div>

                <h1 className="text-5xl font-black text-white">
                  {builder}
                </h1>

                <p className="mt-3 text-zinc-400">
                  Builder Profile
                </p>

              </div>

            </div>

          </div>

        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

              <FolderGit2 className="mb-4 text-emerald-400" />

              <h2 className="text-4xl font-black text-white">
                {projects.length}
              </h2>

              <p className="text-zinc-400">
                Projects
              </p>

            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

              <Eye className="mb-4 text-cyan-400" />

              <h2 className="text-4xl font-black text-white">
                {stats.views}
              </h2>

              <p className="text-zinc-400">
                Views
              </p>

            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

              <Heart className="mb-4 text-red-400" />

              <h2 className="text-4xl font-black text-white">
                {stats.likes}
              </h2>

              <p className="text-zinc-400">
                Likes
              </p>

            </div>

          </div>

        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">

          <h2 className="mb-8 text-3xl font-bold text-white">
            Projects by {builder}
          </h2>

          {loading ? (
            <div className="text-center text-zinc-400">
              Loading...
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
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
```
