
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProduct() {
    console.log('🔍 Checking Romanos product...');

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('id.eq.letter-romanos,title.eq.Romanos');

    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log('✅ Found products:', data);
    }
}

checkProduct();
