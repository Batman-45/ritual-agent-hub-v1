import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, LayoutDashboard, Bookmark, LogOut, Sun, Moon, Monitor, Shield } from "lucide-react";

import logo from "../assets/ritual-logo.png";
import { useTheme } from "../context/ThemeContext";
import { ADMIN_EMAIL } from "../utils/constants";

import { signOut, getCurrentUser } from "../services/supabase";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadUser();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function loadUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setIsAdmin(currentUser?.email === ADMIN_EMAIL);
  }

  async function handleLogout() {
    await signOut();
    window.location.reload();
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Mainnet", href: "/mainnet" },
    { name: "Explore", href: "/search" },
    { name: "Builders", href: "/builders" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Analytics", href: "/analytics" },
    { name: "Bookmarks", href: "/bookmarks" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.user_metadata?.user_name || user?.email || "User"
    )}&background=10b981&color=fff`;

  const desktopNavClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 hover:text-emerald-400 ${
      isActive ? "text-emerald-400" : "text-zinc-400"
    }`;

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${isScrolled ? "bg-[#09090B]/80 backdrop-blur-md border-zinc-800" : "bg-[#09090B] border-transparent"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Ritual Logo"
            className="h-10 w-10 rounded-xl object-contain sm:h-12 sm:w-12"
          />

          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Ritual <span className="text-emerald-400">Agent Hub</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.href} end={item.href === "/"} className={desktopNavClass}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 md:flex">
          <button 
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 transition hover:border-emerald-400 hover:bg-zinc-800"
          >
            {theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Monitor size={18} />}
          </button>
          
          <Link
            to="/search"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 transition hover:border-emerald-400 hover:bg-zinc-800"
          >
            <Search size={18} />
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex cursor-pointer items-center gap-3 rounded-full p-1 pr-4 hover:bg-zinc-800 transition">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border border-zinc-700 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.email || "User"
                    )}&background=10b981&color=fff`;
                  }}
                />

                <span className="font-medium text-zinc-300 text-sm hidden lg:block">
                  {user?.user_metadata?.user_name || user?.email?.split("@")[0]}
                </span>
              </button>

              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <Link
                  to="/bookmarks"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  <Bookmark size={18} className="text-yellow-400" />
                  Bookmarks
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-800 bg-[#09090B] md:hidden overflow-hidden"
          >
            <div className="space-y-2 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white font-medium"
                >
                  {item.name}
                </Link>
              ))}
              
              <button onClick={toggleTheme} className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white font-medium">
                  {theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Monitor size={18} />} Toggle Theme
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 mt-4">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full border border-zinc-700 object-cover"
                    />

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user?.user_metadata?.user_name || user?.email?.split("@")[0]}
                      </p>

                      <p className="text-xs text-zinc-400">Logged in</p>
                    </div>
                  </div>

                  <Link
                    to="/bookmarks"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                  >
                    <Bookmark size={18} className="text-yellow-400" />
                    Bookmarks
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3 text-white transition hover:border-red-500 hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-400 mt-4"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}