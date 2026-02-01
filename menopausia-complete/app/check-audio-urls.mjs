import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function checkAudioUrls() {
    console.log('🎧 Verificando URLs de Áudio...\n');

    // 1. Check Bonus Products
    console.log('--- PRODUTOS BÔNUS ---');
    const { data: bonusProducts } = await supabase
        .from('products')
        .select('id, title, audio_url')
        .eq('category', 'BONUS');

    if (bonusProducts) {
        bonusProducts.forEach(p => {
            const status = p.audio_url && p.audio_url !== '#' ? '✅' : '❌';
            console.log(`${status} ${p.title}`);
            console.log(`   URL: ${p.audio_url || 'VAZIO'}`);
        });
    }

    // 2. Check a few Chapters (e.g., Romans)
    console.log('\n--- CAPÍTULOS (Ex: Romanos) ---');
    // First get Romans ID
    const { data: romanos } = await supabase
        .from('products')
        .select('id')
        .ilike('title', '%Romanos%') // Use ilike for case-insensitive match
        .single();

    if (romanos) {
        const { data: chapters } = await supabase
            .from('chapters')
            .select('title, audio_url, language')
            .eq('product_id', romanos.id)
            .limit(5);

        if (chapters) {
            chapters.forEach(c => {
                const status = c.audio_url && c.audio_url !== '#' ? '✅' : '❌';
                console.log(`${status} [${c.language}] ${c.title}`);
                console.log(`   URL: ${c.audio_url || 'VAZIO'}`);
            });
        } else {
            console.log('Nenhum capítulo encontrado para Romanos.');
        }
    } else {
        console.log('Produto Romanos não encontrado.');
    }
}

checkAudioUrls();
