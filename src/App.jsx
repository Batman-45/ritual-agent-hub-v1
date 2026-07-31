import { Routes, Route } from "react-router-dom";
import BuilderProfile from "./pages/BuilderProfile";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import SubmitAgent from "./pages/SubmitAgent";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";


export default function App() {
  return (
    <Routes>

      <Route
  path="/builder/:builder"
  element={<BuilderProfile />}
/>

      <Route path="/" element={<Home />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/my-projects" element={<MyProjects />} />

      <Route path="/submit" element={<SubmitAgent />} />

      <Route path="/project/:id" element={<ProjectDetails />} />

      <Route path="/project/:id/edit" element={<EditProject />} />

      <Route path="/edit/:id" element={<EditProject />} />

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
            <h1 className="text-4xl font-bold">404 | Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}