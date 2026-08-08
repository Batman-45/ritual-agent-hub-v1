import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixDuplicates() {
  const { data: projects } = await supabase.from("Projects").select("id, name");
  const seen = new Set();
  const toDelete = [];
  
  projects.forEach(p => {
    if (seen.has(p.name)) {
      toDelete.push(p.id);
    } else {
      seen.add(p.name);
    }
  });

  if (toDelete.length > 0) {
    await supabase.from("Projects").delete().in("id", toDelete);
    console.log(`Deleted ${toDelete.length} duplicates`);
  } else {
    console.log("No duplicates found");
  }
}

fixDuplicates();
