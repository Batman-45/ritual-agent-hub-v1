import { Link } from "react-router-dom";
import { Globe, MessageCircle, Star } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-zinc-800 bg-[#09090B]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
               <Star className="h-6 w-6 text-black" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Ritual Agent Hub
                </h2>

                <p className="text-sm text-emerald-400">
                  Community Directory
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-7 text-zinc-400">
              Discover, explore and bookmark every project being built across
              the Ritual ecosystem in one beautiful community directory.
            </p>

          </div>

          {/* Explore */}
          <div>

            <h3 className="mb-5 text-lg font-bold text-white">
              Explore
            </h3>

            <div className="space-y-3">

              <Link
                to="/"
                className="block text-zinc-400 transition hover:text-emerald-400"
              >
                Home
              </Link>

              <Link
                to="/builders"
                className="block text-zinc-400 transition hover:text-emerald-400"
              >
                Builders
              </Link>

              <Link
                to="/leaderboard"
                className="block text-zinc-400 transition hover:text-emerald-400"
              >
                Leaderboard
              </Link>

              <Link
                to="/analytics"
                className="block text-zinc-400 transition hover:text-emerald-400"
              >
                Analytics
              </Link>

            </div>

          </div>

          {/* Community */}
          <div>

            <h3 className="mb-5 text-lg font-bold text-white">
              Community
            </h3>

            <div className="space-y-4">

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-white"
              >
               <Globe size={18} />
                GitHub
              </a>

              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-white"
              >
                <MessageCircle size={18} />
                Discord
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-zinc-400 transition hover:text-white"
              >
                <Star size={18} />
                Twitter / X
              </a>

            </div>

          </div>

        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-zinc-800 pt-8 text-sm text-zinc-500 md:flex-row">

          <p>
            © {year} Ritual Agent Hub. All rights reserved.
          </p>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-400">
            Powered by Ritual
          </div>

        </div>

      </div>
    </footer>
  );
}