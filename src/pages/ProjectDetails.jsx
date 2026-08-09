import ReviewSection from "../components/ReviewSection";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
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
  Bookmark,
  Loader2,
  SearchX,
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
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    setLoading(true);

    // Fetch primary project data
    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProject(data);
    setLikes(data.likes || 0);

    // Run secondary, independent requests in parallel
    const [_, { data: related }, { data: { user } }] = await Promise.all([
      // Increase views (fire-and-forget logic if needed, but keeping it inside here is okay)
      (async () => {
        const viewedKey = `viewed-${data.id}`;
        if (!sessionStorage.getItem(viewedKey)) {
          const newViews = (data.views || 0) + 1;
          await supabase
            .from("Projects")
            .update({ views: newViews })
            .eq("id", data.id);
          setProject((prev) => ({ ...prev, views: newViews }));
          sessionStorage.setItem(viewedKey, "true");
        }
      })(),
      // Related projects
      supabase
        .from("Projects")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3),
      // Check if already bookmarked
      supabase.auth.getUser()
    ]);

    setRelatedProjects(related || []);

    if (user) {
      const { data: existingBookmark } = await supabase
        .from("Bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("project_id", data.id)
        .maybeSingle();

      if (existingBookmark) {
        setBookmarked(true);
      }
    }

    setLoading(false);
  }

  async function handleBookmark() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (bookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from("Bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("project_id", project.id);

      if (!error) {
        setBookmarked(false);
        toast.success("Bookmark removed.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    const { error } = await supabase
      .from("Bookmarks")
      .insert({
        user_id: user.id,
        project_id: project.id,
      });

    if (error) {
      if (error.code === "23505") {
        // Duplicate key — already bookmarked
        toast.error("Already bookmarked!");
      } else {
        toast.error(error.message);
      }
    } else {
      setBookmarked(true);
      toast.success("Project saved!");
    }
  }

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function checkLike() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !project) return;
      const { data } = await supabase
        .from("Likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .maybeSingle();
      setIsLiked(!!data);
    }
    checkLike();
  }, [id, project]);

  async function handleLike() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast.error("Please login to like projects.");
        return;
    }

    if (loading) return; // Prevent concurrent operations
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

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading project...</p>
          </div>
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-white">
          <SearchX size={56} className="text-zinc-600" />
          <h1 className="mt-6 text-3xl font-black md:text-5xl">Project Not Found</h1>
          <p className="mt-4 text-zinc-400">
            The project you're looking for doesn't exist.
          </p>

          <Link
            to="/"
            className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-300"
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
        <section className="relative mx-auto -mt-24 max-w-7xl px-4 sm:px-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl sm:p-10"
          >
            <div className="flex flex-col gap-8 lg:flex-row">
              <img
                src={project.logo || "/placeholder.png"}
                alt={project.name}
                className="h-24 w-24 rounded-3xl border border-zinc-700 object-cover sm:h-32 sm:w-32"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black sm:text-4xl md:text-5xl">
                    {project.name}
                  </h1>

                  {project.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-black text-xs font-semibold">
                      <CheckCircle2 size={16} />
                      Verified
                    </span>
                  )}

                  {project.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-black text-xs font-semibold">
                      <Star size={16} />
                      Featured
                    </span>
                  )}
                </div>

                <p className="mt-4 text-lg leading-relaxed text-zinc-400 sm:text-xl">
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
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 transition hover:border-red-500 hover:text-red-400"
                  >
                    <Heart
                      size={18}
                      className={isLiked ? "fill-red-500 text-red-500" : ""}
                    />
                    <span>{likes}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                      bookmarked
                        ? "border-yellow-500 text-yellow-400"
                        : "border-zinc-700 hover:border-yellow-500 hover:text-yellow-400"
                    }`}
                  >
                    <Bookmark
                      size={18}
                      className={bookmarked ? "fill-yellow-500" : ""}
                    />
                    {bookmarked ? "Saved" : "Save"}
                  </button>

                  <span className="flex items-center gap-2">
                    <Calendar size={18} />
                    {project.launch_date || "Coming Soon"}
                  </span>
                </div>

                {/* External Links */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {project.website && project.website.trim().length > 0 && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
                    >
                      <Globe size={18} />
                      Website
                    </a>
                  )}

                  {project.github && project.github.trim().length > 0 && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 transition hover:border-emerald-500"
                    >
                      <GitBranch size={18} />
                      GitHub
                    </a>
                  )}

                  {project.documentation && project.documentation.trim().length > 0 && (
                    <a
                      href={project.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 transition hover:border-emerald-500"
                    >
                      <BookOpen size={18} />
                      Docs
                    </a>
                  )}

                  {project.discord && project.discord.trim().length > 0 && (
                    <a
                      href={project.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 transition hover:border-emerald-500"
                    >
                      <MessageCircle size={18} />
                      Discord
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tags */}
        {tags.length > 0 && (
          <motion.section 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-7xl px-4 py-10 sm:px-6"
          >
            <h2 className="mb-6 text-2xl font-bold">Tags</h2>

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
          </motion.section>
        )}

        {/* About */}
        {project.description && project.description.trim().length > 0 && (
          <motion.section 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="mx-auto max-w-7xl px-4 py-10 sm:px-6"
          >
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
              <h2 className="mb-6 text-3xl font-bold">About this Project</h2>

              <p className="leading-8 text-zinc-300">{project.description}</p>
            </div>
          </motion.section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
          >
            <h2 className="mb-10 text-3xl font-bold">Related Projects</h2>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Reviews */}
        <motion.section 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
        >
          <h2 className="mb-10 text-3xl font-bold">Reviews</h2>

          <ReviewSection projectId={project.id} />
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
}