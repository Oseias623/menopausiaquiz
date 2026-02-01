import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function listPdfFiles() {
    console.log('📂 Listando arquivos em pdfs/translated...\n');

    const { data: files } = await supabase.storage
        .from('pdfs')
        .list('translated');

    if (files) {
        files.forEach(f => console.log(`   - ${f.name}`));
    } else {
        console.log('Nenhum arquivo encontrado.');
    }
}

listPdfFiles();
