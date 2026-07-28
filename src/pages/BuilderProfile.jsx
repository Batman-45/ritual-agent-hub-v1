import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function BuilderProfile() {
  const { builder } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuilderProjects();
  }, [builder]);

  async function loadBuilderProjects() {
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
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

          <h1 className="text-5xl font-black">
            {decodeURIComponent(builder)}
          </h1>

          <p className="mt-3 text-zinc-400">
            Builder Profile
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-zinc-800 p-6">
              <p className="text-zinc-400">Projects</p>
              <h2 className="mt-2 text-4xl font-bold">
                {projects.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-6">
              <p className="text-zinc-400">Views</p>
              <h2 className="mt-2 text-4xl font-bold">
                {totalViews}
              </h2>
            </div>

            <div className="rounded-2xl bg-zinc-800 p-6">
              <p className="text-zinc-400">Likes</p>
              <h2 className="mt-2 text-4xl font-bold">
                {totalLikes}
              </h2>
            </div>

          </div>

        </div>

        <section className="mt-14">

          <h2 className="mb-8 text-3xl font-bold">
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
    </div>
  );
}