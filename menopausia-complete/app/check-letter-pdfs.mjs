import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function checkLetterPdfs() {
    console.log('📄 Verificando PDFs das Cartas (Letter)...\n');

    const { data: letters, error } = await supabase
        .from('products')
        .select('id, title, pdf_url')
        .eq('category', 'LETTER')
        .order('id');

    if (error) {
        console.log('❌ Erro:', error.message);
        return;
    }

    if (letters) {
        letters.forEach(p => {
            const status = p.pdf_url && p.pdf_url !== '#' ? '✅' : '❌';
            // Extract filename from URL for easier reading
            const filename = p.pdf_url ? p.pdf_url.split('/').pop() : 'VAZIO';
            console.log(`${status} ${p.title}`);
            console.log(`   Arquivo: ${filename}`);
        });
    } else {
        console.log('Nenhuma carta encontrada.');
    }
}

checkLetterPdfs();
