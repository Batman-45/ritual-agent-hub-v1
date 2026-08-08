import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TAXONOMY = {
    'AI': ['agent', 'neural', 'llm', 'mind', 'intel', 'gpt'],
    'DeFi': ['defi', 'swap', 'finance', 'trade', 'token', 'yield'],
    'Infrastructure': ['infra', 'bridge', 'node', 'chain', 'protocol'],
    'Developer Tools': ['tools', 'auditor', 'debugger', 'compiler'],
    'Gaming': ['game', 'play'],
    'NFTs': ['nft', 'art', 'collectible'],
    'Social': ['social', 'chat', 'community'],
    'Identity': ['id', 'identity', 'auth', 'profile'],
    'Data': ['data', 'analytics', 'oracle'],
    'Security': ['security', 'protect', 'safe', 'proof'],
    'Wallets': ['wallet', 'key']
};

function determineCategory(project) {
    const text = `${project.name} ${project.description} ${project.website}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(TAXONOMY)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    return 'Other';
}

async function run() {
    const { data, error } = await supabase.from('Projects').select('id, name, description, website, category');
    if (error) { console.error(error); return; }

    const updates = data.map(project => ({
        ...project,
        proposedCategory: determineCategory(project)
    }));

    // Summary
    const distribution = updates.reduce((acc, p) => {
        acc[p.proposedCategory] = (acc[p.proposedCategory] || 0) + 1;
        return acc;
    }, {});
    
    console.log('--- Proposed Category Distribution ---');
    console.log(JSON.stringify(distribution, null, 2));
    
    console.log('\n--- 10 Sample Projects ---');
    console.log(JSON.stringify(updates.slice(0, 10), null, 2));
}

run();
