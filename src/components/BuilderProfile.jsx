import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Globe,
  Github,
  ArrowLeft,
  Heart,
  Eye,
  Boxes,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../services/supabase";

export default function BuilderProfile() {
  const { builder } = useParams();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuilder();
  }, [builder]);

  async function loadBuilder() {
    setLoading(true);

    const builderName = decodeURIComponent(builder);

    const { data: builderData } = await supabase
      .from("Builders")
      .select("*")
      .eq("name", builderName)
      .single();

    const { data: projectData } = await supabase
      .from("Projects")
      .select("*")
      .eq("builder", builderName)
      .order("created_at", {
        ascending: false,
      });

    setProfile(builderData);
    setProjects(projectData || []);

    setLoading(false);
  }

  const totalLikes = projects.reduce(
    (sum, p) => sum + (p.likes || 0),
    0
  );

  const totalViews = projects.reduce(
    (sum, p) => sum + (p.views || 0),
    0
  );

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="h-96 animate-pulse rounded-3xl bg-zinc-900" />
        </div>

        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white">
        <Navbar />

        <div className="mx-auto max-w-5xl px-6 py-32 text-center">

          <h1 className="text-5xl font-black">
            Builder Not Found
          </h1>

          <p className="mt-5 text-zinc-400">
            This builder profile doesn't exist.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-black"
          >
            <ArrowLeft size={18} />
            Back Home
          </Link>

        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">

        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="rounded-[36px] border border-zinc-800 bg-zinc-900 p-10">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-4xl font-black text-black">
                {initials}
              </div>
            )}

            <div className="flex-1">

              <div className="flex items-center gap-3">

                <h1 className="text-5xl font-black">
                  {profile.name}
                </h1>

                {profile.verified && (
                  <CheckCircle
                    size={28}
                    className="text-emerald-400"
                  />
                )}

              </div>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
                {profile.bio || "Ritual ecosystem builder"}
              </p>
              {/* Social Links */}

<div className="mt-8 flex flex-wrap gap-4">

  {profile.website && (
    <a
      href={profile.website}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition hover:border-emerald-400"
    >
      <Globe size={18} />
      Website
    </a>
  )}

  {profile.github && (
    <a
      href={profile.github}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3 transition hover:border-emerald-400"
    >
      <Github size={18} />
      GitHub
    </a>
  )}

</div>

</div>

</div>

{/* Statistics */}

<div className="mt-12 grid gap-6 md:grid-cols-3">

  <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-8 text-center">

    <Boxes
      size={34}
      className="mx-auto mb-4 text-emerald-400"
    />

    <h2 className="text-4xl font-black">
      {projects.length}
    </h2>

    <p className="mt-2 text-zinc-500">
      Projects
    </p>

  </div>

  <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-8 text-center">

    <Heart
      size={34}
      className="mx-auto mb-4 text-pink-400"
    />

    <h2 className="text-4xl font-black">
      {totalLikes}
    </h2>

    <p className="mt-2 text-zinc-500">
      Total Likes
    </p>

  </div>

  <div className="rounded-3xl border border-zinc-800 bg-[#111113] p-8 text-center">

    <Eye
      size={34}
      className="mx-auto mb-4 text-cyan-400"
    />

    <h2 className="text-4xl font-black">
      {totalViews}
    </h2>

    <p className="mt-2 text-zinc-500">
      Total Views
    </p>

  </div>

</div>

{/* Builder Projects */}

<div className="mt-20">

  <h2 className="text-4xl font-black">
    Projects by {profile.name}
  </h2>

  <p className="mt-3 text-zinc-400">
    Explore everything this builder has created on Ritual.
  </p>

</div>

<div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3"></div>
{projects.length === 0 ? (

  <div className="col-span-full rounded-3xl border border-dashed border-zinc-700 py-20 text-center">

    <h3 className="text-3xl font-bold">
      No Projects Yet
    </h3>

    <p className="mt-4 text-zinc-500">
      This builder hasn't published any projects yet.
    </p>

  </div>

) : (

  projects.map((project) => (
    <ProjectCard
      key={project.id}
      project={project}
    />
  ))

)}

</div>

</main>

<Footer />

</div>
);
}