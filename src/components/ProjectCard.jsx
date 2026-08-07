import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  MessageCircle,
  Eye,
  Heart,
  CheckCircle2,
  Star,
  GitBranch,
  Trash2,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import { getBuilderBadges } from "../utils/builderBadges.jsx";
import { Badge } from "./Badge.jsx";

function formatNumber(num = 0) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function ProjectCard({ project, onEdit, onDelete }) {
 
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkBookmark() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("Bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .maybeSingle();
      setSaved(!!data);
    }
    checkBookmark();
  }, [project.id]);

  async function toggleBookmark() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to bookmark projects.");
      return;
    }

    if (saved) {
      const { error } = await supabase
        .from("Bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("project_id", project.id);

      if (!error) {
        setSaved(false);
        toast.success("Bookmark removed.");
      } else {
        toast.error(error.message);
      }
    } else {
      const { error } = await supabase
        .from("Bookmarks")
        .insert({ user_id: user.id, project_id: project.id });

      if (!error) {
        setSaved(true);
        toast.success("Project bookmarked!");
      } else {
        toast.error(error.message);
      }
    }
  }

  const [likes, setLikes] = useState(project.likes || 0);
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const initials = useMemo(() => {
    return (project.name || "Project")
      .split(" ")
      .map((w) => w[0])
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

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function checkLike() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("Likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .maybeSingle();
      setIsLiked(!!data);
    }
    checkLike();
  }, [project.id]);

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast.error("Please login to like projects.");
        return;
    }

    if (loading) return; // Prevent multiple concurrent clicks
    setLoading(true);

    try {
      if (isLiked) {
          // Unlike
          const { error: delError } = await supabase
              .from("Likes")
              .delete()
              .eq("user_id", user.id)
              .eq("project_id", project.id);
          
          if (delError) throw delError;

          const { error: updError } = await supabase
              .from("Projects")
              .update({ likes: Math.max(0, likes - 1) })
              .eq("id", project.id);
          
          if (updError) throw updError;

          setIsLiked(false);
          setLikes(prev => Math.max(0, prev - 1));
          toast.success("Like removed.");
      } else {
          // Like
          const { error: insError } = await supabase
              .from("Likes")
              .insert({ user_id: user.id, project_id: project.id });
          
          if (insError) throw insError;

          const { error: updError } = await supabase
              .from("Projects")
              .update({ likes: likes + 1 })
              .eq("id", project.id);
          
          if (updError) throw updError;

          setIsLiked(true);
          setLikes(prev => prev + 1);
          toast.success("Project liked!");
      }
    } catch (error) {
      toast.error("Failed to update like status.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const badges = useMemo(() => getBuilderBadges({
    likes: project.likes,
    projects: [project],
    is_verified: project.verified
  }), [project]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/project/${project.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/project/${project.id}`);
        }
      }}
      aria-label={`View project: ${project.name}`}
      className="group flex flex-col cursor-pointer overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-visible:border-emerald-400"
    >
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        {project.image && !bannerError ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            onError={() => setBannerError(true)}
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
          {project.logo && !logoError ? (
            <img
              src={project.logo}
              alt={project.name}
              loading="lazy"
              onError={() => setLogoError(true)}
              className="h-16 w-16 rounded-2xl border border-zinc-700 bg-zinc-900 object-cover shadow-lg transition duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-bold text-black shadow-lg">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-white group-hover:text-emerald-400">
              {project.name}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-zinc-400">
                by{" "}
                <Link
                  to={`/builder/${encodeURIComponent(project.builder || "Unknown Builder")}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-emerald-400 hover:underline"
                >
                  {project.builder || "Unknown Builder"}
                </Link>
              </p>
              <div className="flex gap-1">
                {badges.map((b) => <Badge key={b.label} {...b} />)}
              </div>
            </div>

            <div className="mt-3">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {project.category}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 line-clamp-3 text-sm leading-7 text-zinc-400">
          {project.description}
        </p>

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

        <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Eye size={16} />
              {formatNumber(project.views)}
            </div>

            <button
              onClick={handleLike}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400"
            >
              <Heart size={16} />
              {formatNumber(likes)}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark();
              }}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                saved
                  ? "border-yellow-500 bg-yellow-500 text-black"
                  : "border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-black"
              }`}
            >
              {saved ? "Saved" : "Save"}
            </button>
<Link
  to={`/project/${project.id}`}
  onClick={(e) => e.stopPropagation()}
  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
>
  View
</Link>
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 hover:border-emerald-500"
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
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 hover:border-emerald-500"
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
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 hover:border-emerald-500"
              >
                <MessageCircle size={16} />
              </a>
            )}

            {onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                className="rounded-xl border border-emerald-500 bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500 hover:text-white"
              >
                <Pencil size={16} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className="rounded-xl border border-red-500 bg-red-500/10 p-2 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}