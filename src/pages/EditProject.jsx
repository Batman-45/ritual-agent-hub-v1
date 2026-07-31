import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabase";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    website: "",
    github: "",
    documentation: "",
    discord: "",
    logo: "",
    image: "",
    tags: "",
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

    if (!error && data) {
      setForm({
        name: data.name || "",
        description: data.description || "",
        category: data.category || "",
        website: data.website || "",
        github: data.github || "",
        documentation: data.documentation || "",
        discord: data.discord || "",
        logo: data.logo || "",
        image: data.image || "",
        tags: Array.isArray(data.tags)
          ? data.tags.join(", ")
          : data.tags || "",
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("Projects")
      .update({
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
      .eq("id", id);

    if (!error) {
      alert("Project updated successfully!");
      navigate("/my-projects");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-[#09090B] text-white">
          Loading...
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#09090B] text-white">

        <section className="mx-auto max-w-4xl px-6 py-16">

          <h1 className="mb-10 text-5xl font-black">
            Edit Project
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Project Name"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={5}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Website"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="GitHub"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="documentation"
              value={form.documentation}
              onChange={handleChange}
              placeholder="Documentation"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="discord"
              value={form.discord}
              onChange={handleChange}
              placeholder="Discord"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="Logo URL"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Banner Image URL"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="AI, Agent, DeFi"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-8 py-4 font-bold text-black"
            >
              Save Changes
            </button>

          </form>

        </section>

      </main>

      <Footer />
    </>
  );
}