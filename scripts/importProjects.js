import dotenv from "dotenv";
import XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CHANGE THIS TO YOUR EXCEL FILE NAME
const workbook = XLSX.readFile("./scripts/Community_Ritual_Dapps_List.xlsx");

const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet);

async function run() {
  console.log("Clearing existing projects...");
  await supabase.from("Projects").delete().neq("id", 0);
  console.log(`Found ${rows.length} projects to import.`);

  for (const row of rows) {
    // Map based on the observed keys:
    // 'App Name' (Column B) -> name
    // 'DM Mods to add your apps in the List' (Column A) -> website
    // 'App Owners' (Column C) -> builder
    
    const project = {
      name: row["App Name_1"] || "",
      builder: row["App Owners"] || "",
      website: row["App Name"] || "",
      description: row["Description"] || "",
      category: row["Category"] || "Other",
      type: row["Type"] || "dApp",
      twitter: row["Twitter"] || "",
      github: row["Github"] || "",
      documentation: row["Docs"] || "",
      discord: row["Discord"] || "",
      telegram: row["Telegram"] || "",
      logo: row["Logo"] || "",
      image: row["Banner"] || "",
      tags: row["Tags"] || "",
      status: "Active",
      featured: false,
      verified: false,
      likes: 0,
      views: 0,
    };


    // Skip empty names
    if (!project.name) continue;

    const { error } = await supabase
      .from("Projects")
      .insert(project);

    if (error) {
      console.log(`❌ ${project.name}`);
      console.log(error.message);
    } else {
      console.log(`✅ ${project.name}`);
    }
  }

  console.log("🎉 Import Finished!");
}

run();