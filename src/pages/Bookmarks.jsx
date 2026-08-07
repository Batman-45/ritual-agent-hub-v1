import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function Bookmarks() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function loadBookmarks() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: bookmarks } = await supabase
      .from("Bookmarks")
      .select("project_id")
      .eq("user_id", user.id);

    if (!bookmarks || bookmarks.length === 0) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const ids = bookmarks.map((b) => b.project_id);

    const { data } = await supabase
      .from("Projects")
      .select("*")
      .in("id", ids);

    setProjects(data || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading bookmarks...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 flex items-center gap-3 text-4xl font-black sm:text-5xl">
            <Bookmark size={40} className="text-yellow-400" />
            My Bookmarks
          </h1>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <Bookmark size={56} className="mx-auto text-zinc-600" />
              <h2 className="mt-6 text-2xl font-bold">No bookmarks yet</h2>
              <p className="mt-3 text-zinc-500">
                Start saving projects you love!
              </p>
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
        </div>
      </main>

      <Footer />
    </>
  );
}