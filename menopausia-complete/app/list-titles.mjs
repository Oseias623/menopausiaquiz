
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTitles() {
    console.log('🔍 Listing all product titles...');

    const { data, error } = await supabase
        .from('products')
        .select('id, title, category')
        .eq('category', 'BONUS');

    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log('✅ Found letters:', data.map(p => ({ id: p.id, title: p.title })));
    }
}

listTitles();
