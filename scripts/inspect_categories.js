import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase.from('Projects').select('category');
    if (error) {
        console.error(error);
        return;
    }
    
    const categories = data.map(p => p.category || 'Uncategorized');
    const counts = categories.reduce((acc, cat) => {
        const normalized = cat.trim();
        acc[normalized] = (acc[normalized] || 0) + 1;
        return acc;
    }, {});
    
    console.log(JSON.stringify(counts, null, 2));
}

run();
