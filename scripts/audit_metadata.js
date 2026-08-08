import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase.from('Projects').select('*');
    if (error) { console.error(error); return; }

    const fields = ['name', 'website', 'builder', 'description', 'category', 'tags', 'github', 'twitter', 'discord'];
    const stats = fields.reduce((acc, field) => {
        acc[field] = { populated: 0, empty: 0 };
        return acc;
    }, {});

    data.forEach(p => {
        fields.forEach(field => {
            if (p[field] && p[field].toString().trim().length > 0) {
                stats[field].populated++;
            } else {
                stats[field].empty++;
            }
        });
    });

    console.log('--- Field Population Stats ---');
    console.log(JSON.stringify(stats, null, 2));

    console.log('\n--- 10 Representative Projects ---');
    console.log(JSON.stringify(data.slice(0, 10), null, 2));
}

run();
