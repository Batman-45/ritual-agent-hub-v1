import {
  Globe,
  Heart,
  Sparkles,
  GitBranch,
  MessageCircle,
} from "lucide-react";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-zinc-800 bg-[#09090B]">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400">

                <Sparkles
                  className="text-black"
                  size={22}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-white">
  Ritual Agent Hub
</h2>

<p className="text-sm text-emerald-400">
  Discover • Build • Explore
</p>

              </div>

            </div>

            <p className="max-w-sm leading-7 text-zinc-400">
              Explore the growing Ritual ecosystem.
              Find AI projects, autonomous agents,
              infrastructure and developer tools.
            </p>

          </div>

          {/* Navigation */}

          <div>

            <h3 className="mb-5 font-semibold text-white">
              Explore
            </h3>

            <ul className="space-y-3 text-zinc-400">

              <li>
                <a href="#projects" className="hover:text-white">
                  Projects
                </a>
              </li>

              <li>
                <a href="#agents" className="hover:text-white">
                  Agents
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white">
                  Categories
                </a>
              </li>

            </ul>

          </div>

          {/* Developers */}

          <div>

            <h3 className="mb-5 font-semibold text-white">
              Developers
            </h3>

            <ul className="space-y-3 text-zinc-400">

              <li>
                <a href="/" className="hover:text-white">
                  Documentation
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white">
                  API
                </a>
              </li>

              <li>
                <a href="/" className="hover:text-white">
                  Submit Project
                </a>
              </li>

            </ul>

          </div>

          {/* Social */}

          <div>

            <h3 className="mb-5 font-semibold text-white">
              Community
            </h3>

            <div className="flex gap-4">

              <a
                href="/"
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:border-emerald-500"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href="/"
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:border-emerald-500"
              >
                <GitBranch size={18} />
              </a>

              <a
                href="/"
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:border-emerald-500"
              >
                <Globe size={18} />
              </a>

            </div>

          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 md:flex-row">

          <p className="text-sm text-zinc-500">
  © {year} Ritual Agent Hub. All rights reserved.
</p>

<p className="flex items-center gap-2 text-sm text-zinc-500">
  Built with
  <Heart
    size={16}
    className="text-red-500"
    fill="currentColor"
  />
  for the Ritual Ecosystem • React • Supabase • Vercel
</p>

        </div>

      </div>
    </footer>
  );
}