import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import EditProject from "./pages/EditProject";
import MyDashboard from "./pages/MyDashboard";
import BuilderProfile from "./pages/BuilderProfile";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import SubmitAgent from "./pages/SubmitAgent";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-emerald-500/30">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
  path="/explore"
  element={<Explore />}
/>

        <Route
          path="/project/:id"
          element={<ProjectDetails />}
        />

        <Route
          path="/builder/:builder"
          element={<BuilderProfile />}
        />

        <Route
          path="/submit"
          element={<SubmitAgent />}
        />
        <Route
  path="/my-dashboard"
  element={
    <ProtectedRoute>
      <MyDashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit-project/:id"
  element={
    <ProtectedRoute>
      <EditProject />
    </ProtectedRoute>
  }
/>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}