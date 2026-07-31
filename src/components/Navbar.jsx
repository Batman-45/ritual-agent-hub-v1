import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Plus, Search } from "lucide-react";

import logo from "../assets/ritual-logo.png";

import {
  signInWithGitHub,
  signOut,
  getCurrentUser,
} from "../services/supabase";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  async function handleLogout() {
    await signOut();
    window.location.reload();
  }

  const navItems = [
    { name: "Explore", href: "/" },
    { name: "Projects", href: "/#projects" },
    { name: "Agents", href: "/#agents" },
  ];

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.user_metadata?.user_name || user?.email || "User"
    )}&background=10b981&color=fff`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-4">
          <img
            src={logo}
            alt="Ritual Logo"
            className="h-12 w-12 rounded-xl object-contain"
          />

          <div>
            <h1 className="text-xl font-bold text-white">
              Ritual Agent Hub
            </h1>

            <p className="text-xs text-emerald-400">
              Built for the Ritual Ecosystem
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-medium text-emerald-400"
                  : "text-sm font-medium text-zinc-400 hover:text-white"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}

        <div className="hidden items-center gap-4 md:flex">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
            <Search size={18} />
          </button>

          {user ? (
            <>
              <>
  <img
    src={
      user?.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.email || "User"
      )}`
    }
    alt="Avatar"
    className="h-10 w-10 rounded-full object-cover"
  />

  <Link
    to="/my-projects"
    className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white hover:border-emerald-500"
  >
    My Projects
  </Link>

  <Link
    to="/profile"
    className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white hover:border-emerald-500"
  >
    Profile
  </Link>
  <Link
  to="/dashboard"
  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white hover:border-emerald-500"
>
  Dashboard
</Link>

  <Link
    to="/submit"
    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:scale-105"
  >
    <Plus size={18} />
    Submit Project
  </Link>

  <button
    onClick={handleLogout}
    className="rounded-xl border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white"
  >
    Logout
  </button>
</>
            </>
          ) : (
            <button
              onClick={signInWithGitHub}
              className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-black"
            >
              Login with GitHub
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="border-t border-zinc-800 bg-[#09090B] md:hidden">
          <div className="space-y-2 p-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white"
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover border border-zinc-700"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.email || "User"
                      )}&background=10b981&color=fff`;
                    }}
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user?.user_metadata?.user_name ||
                        user?.email?.split("@")[0]}
                    </p>

                    <p className="text-xs text-zinc-400">
                      Logged in
                    </p>
                  </div>
                </div>

                <Link
                  to="/submit"
                  onClick={() => setOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 font-semibold text-black"
                >
                  <Plus size={18} />
                  Submit Project
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-zinc-700 py-3 text-white hover:border-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 font-semibold text-black"
              >
                Login with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}