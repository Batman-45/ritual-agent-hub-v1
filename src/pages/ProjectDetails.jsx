import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Heart,
  Globe,
  GitBranch,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  Star,
  Calendar,
  Package,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

function formatNumber(num = 0) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);

  const [liking, setLiking] = useState(false);

  const tags = useMemo(() => {
    if (!project?.tags) return [];

    if (Array.isArray(project.tags)) return project.tags;

    return project.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [project]);

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

    if (error || !data) {
      setProject(null);
      setLoading(false);
      return;
    }

    const newViews = (data.views || 0) + 1;

    await supabase
      .from("Projects")
      .update({
        views: newViews,
      })
      .eq("id", id);

    data.views = newViews;

    setViews(newViews);
    setLikes(data.likes || 0);
    setProject(data);

    const { data: related } = await supabase
      .from("Projects")
      .select("*")
      .eq("category", data.category)
      .neq("id", data.id)
      .limit(3);

    setRelatedProjects(related || []);

    setLoading(false);
  }

  async function handleLike() {
    if (liking) return;

    setLiking(true);

    const newLikes = likes + 1;

    const { error } = await supabase
      .from("Projects")
      .update({
        likes: newLikes,
      })
      .eq("id", id);

    if (!error) {
      setLikes(newLikes);
    }

    setLiking(false);
  }
    if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#09090B]">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="animate-pulse">
              <div className="h-80 rounded-3xl bg-zinc-800" />
              <div className="mt-8 flex gap-6">
                <div className="h-28 w-28 rounded-3xl bg-zinc-800" />
                <div className="flex-1">
                  <div className="h-10 w-72 rounded bg-zinc-800" />
                  <div className="mt-4 h-5 w-40 rounded bg-zinc-800" />
                  <div className="mt-6 h-20 rounded bg-zinc-800" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-6">
          <div className="text-center">
            <Package
              size={72}
              className="mx-auto text-zinc-600"
            />

            <h1 className="mt-6 text-4xl font-bold">
              Project Not Found
            </h1>

            <p className="mt-3 text-zinc-400">
              The requested project doesn't exist.
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
            >
              <ArrowLeft size={18} />
              Back Home
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">

        {/* Banner */}

        <section className="relative h-[360px] overflow-hidden">

          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent" />
        </section>

        <section className="relative -mt-20 mx-auto max-w-7xl px-6">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <div className="flex flex-col gap-8 lg:flex-row">

              {/* Logo */}

              <div className="flex-shrink-0">
                {project.logo ? (
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="h-32 w-32 rounded-3xl border border-zinc-700 object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-emerald-500 text-4xl font-bold text-black">
                    {project.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-4xl font-black">
                    {project.name}
                  </h1>

                  {project.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-black">
                      <CheckCircle2 size={16} />
                      Verified
                    </span>
                  )}

                  {project.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-black">
                      <Star size={16} />
                      Featured
                    </span>
                  )}

                </div>

                <p className="mt-3 text-lg text-zinc-400">
                  by {project.builder}
                </p>

                <p className="mt-6 max-w-4xl leading-8 text-zinc-300">
                  {project.description}
                </p>

                {/* Tags */}

                <div className="mt-6 flex flex-wrap gap-2">

                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}

                </div>
                                {/* Action Buttons */}

                <div className="mt-8 flex flex-wrap gap-3">

                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400"
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
                      className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 transition hover:border-emerald-500"
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
                      className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 transition hover:border-emerald-500"
                    >
                      <BookOpen size={18} />
                      Docs
                    </a>
                  )}

                  {project.twitter && (
                    <a
                      href={project.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 transition hover:border-emerald-500"
                    >
                      𝕏
                    </a>
                  )}

                  {project.discord && (
                    <a
                      href={project.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 transition hover:border-emerald-500"
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

        {/* Statistics */}

        <section className="mx-auto mt-10 max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-zinc-400">
                <Eye size={18} />
                Views
              </div>

              <h3 className="mt-4 text-4xl font-black">
                {formatNumber(views)}
              </h3>
            </div>

            <button
              onClick={handleLike}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-left backdrop-blur-xl transition hover:border-red-500"
            >
              <div className="flex items-center gap-3 text-zinc-400">
                <Heart size={18} />
                Likes
              </div>

              <h3 className="mt-4 text-4xl font-black">
                {formatNumber(likes)}
              </h3>
            </button>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-zinc-400">
                <Calendar size={18} />
                Launch Date
              </div>

              <h3 className="mt-4 text-2xl font-bold">
                {project.launch_date || "Coming Soon"}
              </h3>
            </div>

          </div>
        </section>

        {/* Project Information */}

        <section className="mx-auto mt-10 max-w-7xl px-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 backdrop-blur-xl">

            <h2 className="mb-6 text-2xl font-bold">
              Project Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <InfoRow label="Category" value={project.category} />
              <InfoRow label="Type" value={project.type} />
              <InfoRow label="Status" value={project.status} />
              <InfoRow label="Builder" value={project.builder} />
              <InfoRow
                label="Launch Date"
                value={project.launch_date || "TBA"}
              />

            </div>

          </div>
        </section>

        {/* Related Projects */}

        {relatedProjects.length > 0 && (
          <section className="mx-auto mt-16 max-w-7xl px-6">
            <h2 className="mb-8 text-3xl font-bold">
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

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value || "-"}
      </p>
    </div>
  );
}