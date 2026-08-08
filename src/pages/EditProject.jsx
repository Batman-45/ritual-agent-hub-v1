import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/storage";
import { ADMIN_EMAIL } from "../utils/constants";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    website: "",
    github: "",
    twitter: "",
    documentation: "",
    discord: "",
    logo: "",
    image: "",
  });

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Verify admin access (ProtectedRoute handles route-level protection, but we verify here too)
    if (!user || user.email !== ADMIN_EMAIL) {
        toast.error("You are not authorized to edit projects.");
        navigate("/");
        return;
    }

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setForm({
        name: data.name || "",
        description: data.description || "",
        category: data.category || "",
        website: data.website || "",
        github: data.github || "",
        twitter: data.twitter || "",
        documentation: data.documentation || "",
        discord: data.discord || "",
        logo: data.logo || "",
        image: data.image || "",
      });
    } else {
      toast.error("Failed to load project.");
      navigate("/admin");
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function updateProject(e) {
    e.preventDefault();

    setSaving(true);

    let logoUrl = form.logo;
    let bannerUrl = form.image;

    try {
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, "project-logos");
      }

      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, "project-banners");
      }

      const { error } = await supabase
        .from("Projects")
        .update({
          ...form,
          logo: logoUrl,
          image: bannerUrl,
        })
        .eq("id", id);

      if (!error) {
        toast.success("Project updated!");
        navigate("/admin");
      } else {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20";

  const labelClass = "mb-2 block text-sm font-medium text-zinc-400";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white">
        <Navbar />
        <main className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-emerald-400" />
            <p className="text-zinc-400">Loading project...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-8 text-4xl font-black">Edit Project</h1>

        <form onSubmit={updateProject} className="space-y-6">
          <div>
            <label className={labelClass}>Project Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Project Name"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              placeholder="Category"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className={labelClass}>GitHub</label>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className={labelClass}>Twitter / X</label>
              <input
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://x.com/..."
              />
            </div>

            <div>
              <label className={labelClass}>Documentation</label>
              <input
                name="documentation"
                value={form.documentation}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://docs..."
              />
            </div>

            <div>
              <label className={labelClass}>Discord</label>
              <input
                name="discord"
                value={form.discord}
                onChange={handleChange}
                className={inputClass}
                placeholder="Discord invite link"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Project Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-emerald-400"
              />
            </div>

            <div>
              <label className={labelClass}>Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-emerald-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Project
              </>
            )}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}