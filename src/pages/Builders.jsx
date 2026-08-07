import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Heart, Eye, Users, Boxes, Medal, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function Builders() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBuilders();
  }, []);

  async function loadBuilders() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("status", "Active");

    if (error) {
      console.error(error);
      setError("Failed to load builders. Please try again.");
      setLoading(false);
      return;
    }

    const stats = {};

    (data || []).forEach((project) => {
      const builder = project.builder || "Unknown";

      if (!stats[builder]) {
        stats[builder] = {
          name: builder,
          projects: 0,
          likes: 0,
          views: 0,
        };
      }

      stats[builder].projects += 1;
      stats[builder].likes += project.likes || 0;
      stats[builder].views += project.views || 0;
    });

    const ranking = Object.values(stats).sort((a, b) => {
      if (b.likes !== a.likes) return b.likes - a.likes;
      if (b.views !== a.views) return b.views - a.views;
      return b.projects - a.projects;
    });

    setBuilders(ranking);
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading builders...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-white">
          <h1 className="text-3xl font-black">Something went wrong</h1>
          <p className="mt-4 text-zinc-400">{error}</p>
          <button
            onClick={loadBuilders}
            className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-300"
          >
            Try Again
          </button>
        </main>
      </>
    );
  }

  const totalBuilders = builders.length;
  const totalProjects = builders.reduce((sum, b) => sum + b.projects, 0);
  const totalLikes = builders.reduce((sum, b) => sum + b.likes, 0);

  const stats = [
    { icon: Users, value: totalBuilders, label: "Builders" },
    { icon: Boxes, value: totalProjects, label: "Projects" },
    { icon: Heart, value: totalLikes, label: "Total Likes" },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="flex items-center gap-3 text-4xl font-black sm:text-5xl">
            <Trophy size={40} className="text-yellow-400" />
            Top Builders
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Discover the most influential builders in the Ritual ecosystem.
          </p>

          {/* Stats */}
          <div className="mt-10 mb-12 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-500"
                >
                  <Icon size={24} className="mb-3 text-emerald-400" />
                  <p className="text-4xl font-black text-emerald-400">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-zinc-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {builders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-700 py-20 text-center">
              <Users size={48} className="mx-auto text-zinc-600" />
              <p className="mt-6 text-2xl font-bold text-zinc-300">
                No builders yet
              </p>
              <p className="mt-3 text-zinc-500">
                Builders will appear once projects are submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {builders.map((builder, index) => (
                <Link
                  key={builder.name}
                  to={`/builder/${encodeURIComponent(builder.name)}`}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-emerald-400 hover:bg-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-lg font-black">
                      {index === 0 ? (
                        <Medal size={20} className="text-yellow-400" />
                      ) : index === 1 ? (
                        <Medal size={20} className="text-zinc-300" />
                      ) : index === 2 ? (
                        <Medal size={20} className="text-orange-400" />
                      ) : (
                        `#${index + 1}`
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold sm:text-2xl">
                        {builder.name}
                      </h2>

                      <p className="text-sm text-zinc-400">
                        {builder.projects} Project
                        {builder.projects !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm sm:text-base">
                    <span className="flex items-center gap-1.5">
                      <Heart size={16} className="text-red-400" />
                      {builder.likes}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Eye size={16} className="text-cyan-400" />
                      {builder.views}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}