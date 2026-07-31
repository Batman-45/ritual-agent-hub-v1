import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FolderGit2,
  Heart,
  Eye,
  User,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function BuilderProfile() {
  const { builder } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [builder]);

  async function loadProjects() {
    setLoading(true);

    const { data } = await supabase
      .from("Projects")
      .select("*")
      .eq("builder", decodeURIComponent(builder));

    setProjects(data || []);
    setLoading(false);
  }

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

        <section className="mx-auto max-w-7xl px-6 py-16">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

            <div className="flex items-center gap-6">

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500 text-black">
                <User size={48} />
              </div>

              <div>

                <h1 className="text-5xl font-black">
                  {decodeURIComponent(builder)}
                </h1>

                <p className="mt-3 text-zinc-400">
                  Ritual Ecosystem Builder
                </p>

              </div>

            </div>

          </div>

        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">

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

        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">

          <h2 className="mb-10 text-3xl font-bold">
            Projects
          </h2>

          {loading ? (

            <p>Loading...</p>

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