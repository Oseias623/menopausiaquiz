import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function debugStorage() {
    console.log('🕵️‍♂️ Investigando Storage...\n');

    // 1. List Buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) console.log('❌ Erro listar buckets:', error.message);
    else {
        console.log('📦 Buckets disponíveis:');
        buckets.forEach(b => console.log(`   - ${b.name}`));
    }

    console.log('\n--- Checking pdfs/translated ---');
    const { data: pdfsTrans } = await supabase.storage.from('pdfs').list('translated');
    if (pdfsTrans) pdfsTrans.forEach(f => console.log(`   ${f.name}`));
}

debugStorage();
