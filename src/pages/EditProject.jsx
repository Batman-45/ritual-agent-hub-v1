import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
    builder: "",
    website: "",
    github: "",
    documentation: "",
    twitter: "",
    discord: "",
    logo: "",
    image: "",
    tags: "",
    status: "",
    launch_date: "",
  });

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      navigate("/");
      return;
    }

    setForm({
      name: data.name || "",
      description: data.description || "",
      category: data.category || "",
      type: data.type || "",
      builder: data.builder || "",
      website: data.website || "",
      github: data.github || "",
      documentation: data.documentation || "",
      twitter: data.twitter || "",
      discord: data.discord || "",
      logo: data.logo || "",
      image: data.image || "",
      tags: data.tags || "",
      status: data.status || "",
      launch_date: data.launch_date || "",
    });

    setLoading(false);
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("Projects")
      .update(form)
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Project updated successfully!");

    navigate(`/project/${id}`);
  }
    if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
        Loading project...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">

        {/* Hero */}

        <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-500/10 to-transparent">

          <div className="mx-auto max-w-7xl px-6 py-14">

            <h1 className="text-5xl font-black text-white">
              Edit Project
            </h1>

            <p className="mt-4 text-lg text-zinc-400">
              Update your Ritual project details.
            </p>

          </div>

        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl"
          >

            {/* Project Name */}

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Project Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <input
                name="builder"
                value={form.builder}
                onChange={handleChange}
                placeholder="Builder"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="Type"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="status"
                value={form.status}
                onChange={handleChange}
                placeholder="Status"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Website"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="GitHub"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="documentation"
                value={form.documentation}
                onChange={handleChange}
                placeholder="Documentation"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="Twitter"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="discord"
                value={form.discord}
                onChange={handleChange}
                placeholder="Discord"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="logo"
                value={form.logo}
                onChange={handleChange}
                placeholder="Logo URL"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Banner URL"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="AI, Agent, DeFi"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

              <input
                type="date"
                name="launch_date"
                value={form.launch_date}
                onChange={handleChange}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              />

            </div>
                        <div className="flex flex-col gap-4 pt-6 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-4 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/project/${id}`)}
                className="rounded-2xl border border-zinc-700 px-8 py-4 font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                Cancel
              </button>

            </div>

          </form>

          {/* Live Preview */}

          <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">

            <div className="h-48 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-zinc-900">

              {form.image && (
                <img
                  src={form.image}
                  alt={form.name}
                  className="h-full w-full object-cover"
                />
              )}

            </div>

            <div className="p-8">

              <div className="flex items-center gap-5">

                {form.logo ? (
                  <img
                    src={form.logo}
                    alt={form.name}
                    className="h-20 w-20 rounded-2xl border border-zinc-700 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-bold text-black">
                    {form.name?.charAt(0) || "R"}
                  </div>
                )}

                <div>

                  <h2 className="text-3xl font-bold text-white">
                    {form.name || "Project Name"}
                  </h2>

                  <p className="mt-1 text-emerald-400">
                    {form.builder || "Builder"}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    {form.category} • {form.type}
                  </p>

                </div>

              </div>

              <p className="mt-6 leading-7 text-zinc-400">
                {form.description || "Project description preview..."}
              </p>

              {form.tags && (
                <div className="mt-6 flex flex-wrap gap-2">

                  {form.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
                    >
                      {tag.trim()}
                    </span>
                  ))}

                </div>
              )}

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}