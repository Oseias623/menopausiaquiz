import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function listAllBuckets() {
    console.log('🔍 Varrendo buckets...\n');

    const buckets = ['audios', 'pdfs', 'images', 'public'];

    for (const bucket of buckets) {
        console.log(`=== BUCKET: ${bucket} ===`);
        const { data, error } = await supabase.storage
            .from(bucket)
            .list();

        if (error) {
            console.log(`   (Erro ou não existe): ${error.message}`);
        } else if (data && data.length > 0) {
            data.slice(0, 20).forEach(f => console.log(`   📄 ${f.name} (${(f.metadata?.size / 1024).toFixed(1)} KB)`));
            if (data.length > 20) console.log(`   ... e mais ${data.length - 20} arquivos`);
        } else {
            console.log('   (Vazio)');
        }
        console.log('');
    }
}

listAllBuckets();
