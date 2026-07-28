import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ProjectCard from "./ProjectCard";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("featured", true)
      .eq("status", "approved")
      .order("likes", { ascending: false })
      .limit(6);

    if (!error) {
      setProjects(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-10 text-4xl font-black text-white">
          ⭐ Featured Projects
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[500px] animate-pulse rounded-3xl bg-zinc-900"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-emerald-400 font-semibold">
            Community Favorites
          </p>

          <h2 className="mt-2 text-5xl font-black text-white">
            Featured Projects
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Discover the most popular AI agents, infrastructure,
            developer tools and applications built on Ritual.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}