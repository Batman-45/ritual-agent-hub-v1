import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectData() {
  const { data, error, count } = await supabase
    .from("Projects")
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  console.log(`Total count: ${count}`);
  console.log("First 3 records:", JSON.stringify(data.slice(0, 3), null, 2));
}

inspectData();
