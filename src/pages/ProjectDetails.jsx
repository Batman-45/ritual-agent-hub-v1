import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Globe,
  GitBranch,
  MessageCircle,
  BookOpen,
  Eye,
  Heart,
  Calendar,
  CheckCircle2,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setProject(data);
      setLikes(data.likes || 0);

      await supabase
        .from("Projects")
        .update({
          views: (data.views || 0) + 1,
        })
        .eq("id", data.id);

      const { data: related } = await supabase
        .from("Projects")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3);

      setRelatedProjects(related || []);
    }

    setLoading(false);
  }

  async function handleLike() {
    const newLikes = likes + 1;

    const { error } = await supabase
      .from("Projects")
      .update({
        likes: newLikes,
      })
      .eq("id", project.id);

    if (!error) {
      setLikes(newLikes);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
          Loading...
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-white">

          <h1 className="text-5xl font-black">
            Project Not Found
          </h1>

          <Link
            to="/"
            className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-black"
          >
            Back Home
          </Link>

        </main>
      </>
    );
  }

  const tags = Array.isArray(project.tags)
    ? project.tags
    : project.tags
    ? project.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">

        {/* Banner */}

        <div className="relative h-[420px] overflow-hidden">

          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-transparent" />

        </div>

        {/* Hero */}

        <section className="relative mx-auto -mt-24 max-w-7xl px-6">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

            <div className="flex flex-col gap-8 lg:flex-row">

              <img
                src={project.logo}
                alt={project.name}
                className="h-32 w-32 rounded-3xl border border-zinc-700 object-cover"
              />

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-5xl font-black">
                    {project.name}
                  </h1>

                  {project.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-black">
                      <CheckCircle2 size={16} />
                      Verified
                    </span>
                  )}

                  {project.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-black">
                      <Star size={16} />
                      Featured
                    </span>
                  )}

                </div>

                <p className="mt-4 text-xl text-zinc-400">
                  {project.description}
                </p>
                <p className="mt-3 text-zinc-400">
  Built by{" "}
  <Link
    to={`/builder/${encodeURIComponent(project.builder)}`}
    className="text-emerald-400 hover:underline"
  >
    {project.builder}
  </Link>
</p>

                <div className="mt-6 flex flex-wrap gap-6 text-zinc-400">

                  <span className="flex items-center gap-2">
                    <Eye size={18} />
                    {project.views || 0}
                  </span>

                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 hover:text-red-400"
                  >
                    <Heart size={18} />
                    {likes}
                  </button>

                  <span className="flex items-center gap-2">
                    <Calendar size={18} />
                    {project.launch_date || "Coming Soon"}
                  </span>

                </div>
                                {/* External Links */}

                <div className="mt-8 flex flex-wrap gap-4">

                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black"
                    >
                      <Globe size={18} />
                      Website
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 hover:border-emerald-500"
                    >
                      <GitBranch size={18} />
                      GitHub
                    </a>
                  )}

                  {project.documentation && (
                    <a
                      href={project.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 hover:border-emerald-500"
                    >
                      <BookOpen size={18} />
                      Docs
                    </a>
                  )}

                  {project.discord && (
                    <a
                      href={project.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 hover:border-emerald-500"
                    >
                      <MessageCircle size={18} />
                      Discord
                    </a>
                  )}

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Tags */}

        {tags.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-10">

            <h2 className="mb-6 text-2xl font-bold">
              Tags
            </h2>

            <div className="flex flex-wrap gap-3">

              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
                >
                  {tag}
                </span>
              ))}

            </div>

          </section>
        )}

        {/* About */}

        <section className="mx-auto max-w-7xl px-6 py-10">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

            <h2 className="mb-6 text-3xl font-bold">
              About this Project
            </h2>

            <p className="leading-8 text-zinc-300">
              {project.description}
            </p>

          </div>

        </section>

        {/* Related Projects */}

        {relatedProjects.length > 0 && (

          <section className="mx-auto max-w-7xl px-6 py-16">

            <h2 className="mb-10 text-3xl font-bold">
              Related Projects
            </h2>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {relatedProjects.map((item) => (
                <ProjectCard
                  key={item.id}
                  project={item}
                />
              ))}

            </div>

          </section>

        )}

      </main>

      <Footer />

    </>
  );
}