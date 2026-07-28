import { useEffect, useState } from "react";
import {
  Boxes,
  Users,
  Heart,
  Eye,
  Star,
} from "lucide-react";

import { supabase } from "../services/supabase";

export default function LiveStats() {
  const [stats, setStats] = useState({
    projects: 0,
    builders: 0,
    likes: 0,
    views: 0,
    featured: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data } = await supabase
      .from("Projects")
      .select("*");

    if (!data) return;

    const builders = [
      ...new Set(
        data
          .map((p) => p.builder)
          .filter(Boolean)
      ),
    ];

    setStats({
      projects: data.length,
      builders: builders.length,
      likes: data.reduce(
        (sum, p) => sum + (p.likes || 0),
        0
      ),
      views: data.reduce(
        (sum, p) => sum + (p.views || 0),
        0
      ),
      featured: data.filter(
        (p) => p.featured
      ).length,
    });
  }

  const cards = [
    {
      icon: Boxes,
      value: stats.projects,
      label: "Projects",
    },
    {
      icon: Users,
      value: stats.builders,
      label: "Builders",
    },
    {
      icon: Heart,
      value: stats.likes,
      label: "Likes",
    },
    {
      icon: Eye,
      value: stats.views,
      label: "Views",
    },
    {
      icon: Star,
      value: stats.featured,
      label: "Featured",
    },
  ];

  return (
    <section className="mx-auto mt-20 max-w-7xl px-6">
      <div className="rounded-[32px] border border-zinc-800 bg-zinc-900 p-10">

        <div className="mb-10 text-center">

          <p className="text-emerald-400 font-semibold">
            LIVE ECOSYSTEM
          </p>

          <h2 className="mt-2 text-4xl font-black">
            Ecosystem Statistics
          </h2>

          <p className="mt-3 text-zinc-400">
            Real-time data from the Ritual Ecosystem Portal
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-5">

          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-3xl border border-zinc-800 bg-[#111113] p-6 text-center transition hover:border-emerald-500"
              >
                <Icon
                  size={34}
                  className="mx-auto mb-4 text-emerald-400"
                />

                <h3 className="text-4xl font-black">
                  {item.value}
                </h3>

                <p className="mt-2 text-zinc-500">
                  {item.label}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}