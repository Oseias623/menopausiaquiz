import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function checkLetterAudio() {
    console.log('🎧 Verificando áudio da Carta aos Romanos...\n');

    const { data: product, error } = await supabase
        .from('products')
        .select('id, title, audio_url, category')
        .ilike('title', '%Romanos%')
        .single();

    if (error) {
        console.log('❌ Erro:', error.message);
    } else if (product) {
        console.log(`📖 Produto: ${product.title}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Categoria: ${product.category}`);
        console.log(`   Audio URL: ${product.audio_url || 'VAZIO'}`);
    } else {
        console.log('Produto não encontrado.');
    }
}

checkLetterAudio();
