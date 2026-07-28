import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  MessageCircle,
  Eye,
  Heart,
  CheckCircle2,
  Star,
  GitBranch,
} from "lucide-react";
import { supabase } from "../services/supabase";

function formatNumber(num = 0) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function ProjectCard({ project }) {
  const [likes, setLikes] = useState(project.likes || 0);
  const [loading, setLoading] = useState(false);

  const likedKey = `project-liked-${project.id}`;

  const initials = useMemo(() => {
    return (project.name || "Project")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [project.name]);

  const tags = useMemo(() => {
    if (!project.tags) return [];

    if (Array.isArray(project.tags)) return project.tags;

    return project.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [project.tags]);

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (localStorage.getItem(likedKey)) return;

    setLoading(true);

    const newLikes = likes + 1;

    const { error } = await supabase
      .from("Projects")
      .update({ likes: newLikes })
      .eq("id", project.id);

    if (!error) {
      setLikes(newLikes);
      localStorage.setItem(likedKey, "true");
    }

    setLoading(false);
  }

  return (
    <Link
      to={`/project/${project.id}`}
      className="group block overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
    >
      {/* Banner */}

      <div className="relative h-48 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        <div className="absolute right-4 top-4 flex gap-2">
          {project.featured && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">
              <Star size={12} />
              Featured
            </span>
          )}

          {project.verified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-black">
              <CheckCircle2 size={12} />
              Verified
            </span>
          )}
        </div>
      </div>
            {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          {project.logo ? (
            <img
              src={project.logo}
              alt={project.name}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              className="h-16 w-16 rounded-2xl border border-zinc-700 bg-zinc-900 object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-lg font-bold text-black shadow-lg">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-white transition group-hover:text-emerald-400">
              {project.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              by{" "}
              <span className="font-medium text-zinc-300">
                {project.builder || "Unknown Builder"}
              </span>
            </p>

            <div className="mt-3">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                {project.category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}

        <p className="mt-5 line-clamp-3 text-sm leading-7 text-zinc-400">
          {project.description}
        </p>

        {/* Tags */}

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}

            {tags.length > 3 && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}

        <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Eye size={16} />
              {formatNumber(project.views)}
            </div>

            <button
              onClick={handleLike}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-zinc-400 transition hover:scale-105 hover:text-red-400 active:scale-95 disabled:opacity-50"
            >
              <Heart
                size={16}
                className={loading ? "animate-pulse" : ""}
              />
              {formatNumber(likes)}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 transition hover:border-emerald-500 hover:bg-zinc-700"
              >
                <Globe size={16} />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 transition hover:border-emerald-500 hover:bg-zinc-700"
              >
                <GitBranch size={16} />
              </a>
            )}

            {project.discord && (
              <a
                href={project.discord}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 transition hover:border-emerald-500 hover:bg-zinc-700"
              >
                <MessageCircle size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}