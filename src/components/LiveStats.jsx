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
    <div className="mt-14">
      <div className="rounded-[28px] border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
        <div className="mb-8 text-center">
          <p className="font-semibold text-emerald-400">
            LIVE ECOSYSTEM
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Ecosystem Statistics
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Real-time data from the Ritual Ecosystem Portal
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-5">
          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-[#111113] p-5 text-center transition hover:border-emerald-500"
              >
                <Icon
                  size={28}
                  className="mx-auto mb-3 text-emerald-400"
                />

                <h3 className="text-2xl font-black sm:text-3xl">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}