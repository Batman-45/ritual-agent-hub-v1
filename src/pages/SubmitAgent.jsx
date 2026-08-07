import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Sparkles,
  Send,
} from "lucide-react";

import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/storage";
export default function SubmitAgent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
const [bannerFile, setBannerFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "AI",
    type: "Project",
    builder: "",
    website: "",
    github: "",
    documentation: "",
    twitter: "",
    discord: "",
    logo: "",
    image: "",
    tags: "",
    status: "Active",
    launch_date: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!form.name.trim()) {
    toast.error("Project name is required.");
    return;
  }

  if (!form.description.trim()) {
    toast.error("Description is required.");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("Please login with GitHub first.");
    navigate("/");
    return;
  }

  setLoading(true);

  try {
    let logoUrl = form.logo;
    let bannerUrl = form.image;

    if (logoFile) {
      logoUrl = await uploadImage(
        logoFile,
        "project-logos"
      );
    }

    if (bannerFile) {
      bannerUrl = await uploadImage(
        bannerFile,
        "project-banners"
      );
    }

    const projectData = {
      ...form,
      logo: logoUrl,
      image: bannerUrl,
      launch_date: form.launch_date || null,
      owner_id: user.id,
      featured: false,
      verified: false,
      likes: 0,
      views: 0,
    };

    const { data, error } = await supabase
      .from("Projects")
      .insert([projectData])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!data) {
      toast.error("Failed to create project. Please try again.");
      return;
    }

    toast.success("Project submitted successfully!");
    navigate(`/project/${data.id}`);
   
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}
   
    return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B]">

        {/* Hero */}

        <section className="border-b border-zinc-800 bg-gradient-to-b from-emerald-500/10 to-transparent">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
              <Sparkles size={16} />
              Build the Ritual Ecosystem
            </div>

            <h1 className="mt-6 text-5xl font-black text-white">
              Submit Your Project
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Share your project with the Ritual community. Add details,
              links, and help builders discover your work.
            </p>

          </div>

        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid gap-10 lg:grid-cols-3">

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl"
            >

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Project Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="Ritual Studio"
                />
              </div>

            <div>
  <label className="mb-2 block text-sm text-zinc-400">
    Description *
  </label>

  <textarea
    rows={5}
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Describe your project..."
    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
  />
</div>

<div className="grid gap-6 md:grid-cols-2">

  <div>
    <label className="mb-2 block text-sm text-zinc-400">
      Category
    </label>

    <select
      name="category"
      value={form.category}
      onChange={handleChange}
      className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
    >
      <option>AI</option>
      <option>Agent</option>
      <option>Infrastructure</option>
      <option>Developer Tools</option>
      <option>Gaming</option>
      <option>DeFi</option>
    </select>
  </div>

  <div>
    <label className="mb-2 block text-sm text-zinc-400">
      Type
    </label>

    <select
      name="type"
      value={form.type}
      onChange={handleChange}
      className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
    >
      <option>Project</option>
      <option>Protocol</option>
      <option>Tool</option>
      <option>Library</option>
      <option>Infrastructure</option>
    </select>
  </div>

</div>
  

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Builder
                </label>

                <input
                  name="builder"
                  value={form.builder}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500"
                  placeholder="Your name or team"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="Website"
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="GitHub"
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

                <input
                  name="documentation"
                  value={form.documentation}
                  onChange={handleChange}
                  placeholder="Documentation"
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

                <input
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  placeholder="Twitter / X"
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

                <input
                  name="discord"
                  value={form.discord}
                  onChange={handleChange}
                  placeholder="Discord"
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

              </div>
                            <div className="grid gap-6 md:grid-cols-2">

                <div>
  <label className="mb-2 block text-sm text-zinc-400">
    Project Logo
  </label>

  <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setLogoFile(file);

    if (file) {
      setForm((prev) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
    }
  }}
/>
</div>

<div>
  <label className="mb-2 block text-sm text-zinc-400">
    Banner Image
  </label>

  <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setBannerFile(file);

    if (file) {
      setForm((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  }}
/>
</div>

              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="AI, Agent, DeFi"
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

                <input
                  type="date"
                  name="launch_date"
                  value={form.launch_date}
                  onChange={handleChange}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-4 text-lg font-bold text-black transition hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send size={20} />
                    Submit Project
                  </>
                )}
              </button>

            </form>

            {/* Live Preview */}

            <div className="lg:sticky lg:top-24">

              <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">

                <div className="h-40 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-zinc-900">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Banner"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-6">

                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt="Logo"
                      className="h-20 w-20 rounded-2xl border border-zinc-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-bold text-black">
                      {form.name?.charAt(0) || "R"}
                    </div>
                  )}

                  <h2 className="mt-5 text-2xl font-bold text-white">
                    {form.name || "Project Name"}
                  </h2>

                  <p className="mt-2 text-sm text-emerald-400">
                    {form.builder || "Builder"}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {form.description ||
                      "Your project description will appear here."}
                  </p>

                  {form.tags && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {form.tags
                        .split(",")
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
                    <Upload size={16} />
                    Live Preview
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}