import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function fixRemaining() {
    console.log('🔧 Ajustes finais de áudio...\n');

    // 1. Fix Filemom (Title: FILEMOM, File: letter-filemon-es.m4a)
    const filemonUrl = 'https://dtpydjllcreeibrrtcna.supabase.co/storage/v1/object/public/audios/translated/letter-filemon-es.m4a';

    const { error: err1 } = await supabase
        .from('products')
        .update({ audio_url: filemonUrl })
        .ilike('title', '%Filemom%');

    if (err1) console.log('❌ Erro Filemom:', err1.message);
    else console.log('✅ Filemom corrigido.');

    // 2. Clear Bonus Audios (ensure they are null)
    const { error: err2 } = await supabase
        .from('products')
        .update({ audio_url: null })
        .eq('category', 'BONUS');

    if (err2) console.log('❌ Erro limpar Bônus:', err2.message);
    else console.log('✅ Bônus: Áudios removidos (para não dar erro).');
}

fixRemaining();
