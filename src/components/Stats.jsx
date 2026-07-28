import { useEffect, useState } from "react";
import {
  Boxes,
  Users,
  Star,
  Eye,
} from "lucide-react";

import { supabase } from "../services/supabase";

export default function Stats() {
  const [stats, setStats] = useState({
    projects: 0,
    builders: 0,
    featured: 0,
    views: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const { data, error } = await supabase
      .from("Projects")
      .select("builder, featured, views");

    if (error) {
      console.error(error);
      return;
    }

    const uniqueBuilders = [
      ...new Set(
        data
          .map((p) => p.builder)
          .filter(Boolean)
      ),
    ];

    const totalViews = data.reduce(
      (sum, project) => sum + (project.views || 0),
      0
    );

    setStats({
      projects: data.length,
      builders: uniqueBuilders.length,
      featured: data.filter((p) => p.featured).length,
      views: totalViews,
    });
  }

  const cards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: Boxes,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Builders",
      value: stats.builders,
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Featured",
      value: stats.featured,
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Views",
      value: stats.views.toLocaleString(),
      icon: Eye,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section className="mb-16">
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
              >
                <Icon
                  size={28}
                  className={card.color}
                />
              </div>

              <h2 className="text-4xl font-black text-white">
                {card.value}
              </h2>

              <p className="mt-2 text-zinc-400">
                {card.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}