import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Test() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("Projects") // Your table name
        .select("*");

      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setProjects(data);
      }

      setLoading(false);
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px", fontSize: "20px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Supabase Connection Test</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "8px",
            }}
          >
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p>
              <strong>Category:</strong> {project.category}
            </p>
            <p>
              <strong>Type:</strong> {project.type}
            </p>
            <p>
              <strong>Website:</strong> {project.website}
            </p>
            <p>
              <strong>GitHub:</strong> {project.github}
            </p>
          </div>
        ))
      )}
    </div>
  );
}