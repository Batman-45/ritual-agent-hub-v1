import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { SearchX } from "lucide-react";

import CommandPalette from "./components/CommandPalette";
import Leaderboard from "./pages/Leaderboard";
import Bookmarks from "./pages/Bookmarks";
import Search from "./pages/Search";
import Builders from "./pages/Builders";
import BuilderProfile from "./pages/BuilderProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import SubmitAgent from "./pages/SubmitAgent";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Admin from "./pages/Admin";

export default function App() {
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <CommandPalette isOpen={isPaletteOpen} onClose={setPaletteOpen} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/builders" element={<Builders />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/builder/:builder"
          element={<BuilderProfile />}
        />

        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitAgent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:id/edit"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        <Route path="/project/:id" element={<ProjectDetails />} />

        <Route
          path="*"
          element={
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-center text-white">
              <SearchX size={56} className="text-zinc-600" />
              <h1 className="mt-6 text-4xl font-black">404 | Page Not Found</h1>
              <p className="mt-4 text-zinc-400">
                The page you're looking for doesn't exist.
              </p>
              <Link
                to="/"
                className="mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-300"
              >
                Back Home
              </Link>
            </div>
          }
        />
      </Routes>
    </>
  );
}