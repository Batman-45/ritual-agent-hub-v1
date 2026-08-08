import XLSX from "xlsx"; 
const workbook = XLSX.readFile("./scripts/Community_Ritual_Dapps_List.xlsx"); 
const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
const rows = XLSX.utils.sheet_to_json(sheet); 
console.log(Object.keys(rows[0]));
