import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function listAudioBuckets() {
    console.log('📂 Listando arquivos no bucket de audio...\n');

    // List root of "audios" bucket
    const { data: rootFiles, error } = await supabase.storage
        .from('audios')
        .list();

    if (error) {
        console.log('❌ Erro ao listar bucket:', error.message);
    } else {
        console.log('📁 Raiz (audios):');
        rootFiles.forEach(f => console.log(`   - ${f.name}`));
    }

    // Also check if there's a "translated" folder or similar
    const { data: translatedFiles } = await supabase.storage
        .from('audios')
        .list('translated');

    if (translatedFiles && translatedFiles.length > 0) {
        console.log('\n📁 Pasta "translated":');
        translatedFiles.forEach(f => console.log(`   - ${f.name}`));
    }
}

listAudioBuckets();
