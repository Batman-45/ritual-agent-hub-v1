import { Routes, Route } from "react-router-dom";
import { useState, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

import CommandPalette from "./components/CommandPalette";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Builders from "./pages/Builders";
import BuilderProfile from "./pages/BuilderProfile";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";

const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));

export default function App() {
  const [isPaletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <CommandPalette isOpen={isPaletteOpen} onClose={setPaletteOpen} />
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
          <Loader2 size={48} className="animate-spin text-emerald-400" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
          <Route path="/builders" element={<Builders />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/builder/:builder" element={<BuilderProfile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}