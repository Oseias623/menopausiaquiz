import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

const AUDIO_BUCKET = 'audios';
// This matches the location where files were found
const STORAGE_BASE = 'https://dtpydjllcreeibrrtcna.supabase.co/storage/v1/object/public/audios/translated';
const FOLDER = 'translated';

async function linkAudioFiles() {
    console.log('🔗 Iniciando vinculação automática de áudios (CARTAS)...\n');

    // 1. Get all files in the translated folder
    const { data: files, error: storageError } = await supabase.storage
        .from(AUDIO_BUCKET)
        .list(FOLDER);

    if (storageError) {
        console.error('❌ Erro ao listar arquivos:', storageError.message);
        return;
    }

    if (!files || files.length === 0) {
        console.log('⚠️  Nenhum arquivo encontrado no bucket "audios/translated".');
        return;
    }

    console.log(`📂 Encontrados ${files.length} arquivos de áudio.`);

    // 2. Get LETTER Products
    const { data: products } = await supabase
        .from('products')
        .select('id, title')
        .eq('category', 'LETTER');

    if (!products) {
        console.log('❌ Nenhum produto LETTER encontrado.');
        return;
    }

    // 3. Match and Update
    for (const product of products) {
        // Fuzzy match logic for Letters
        // Product Title: "1 Coríntios" -> Normalized: "1corintios"
        // File Name: "letter-1corintios-es.m4a" -> Normalized: "letter1corintioses"

        const simplifiedTitle = product.title
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9]/g, ""); // Remove non-alphanumeric

        const match = files.find(f => {
            const fname = f.name.toLowerCase().replace(/-/g, "");
            return fname.includes(simplifiedTitle);
        });

        if (match) {
            const audioUrl = `${STORAGE_BASE}/${match.name}`;
            console.log(`✅ MATCH: "${product.title}" -> "${match.name}"`);
            console.log(`   Atualizando URL...`);

            const { error: updateError } = await supabase
                .from('products')
                .update({ audio_url: audioUrl })
                .eq('id', product.id);

            if (updateError) {
                console.log(`   ❌ Erro ao atualizar: ${updateError.message}`);
            } else {
                console.log(`   ✨ Sucesso!`);
            }
        } else {
            console.log(`⚠️  Sem correspondência para: "${product.title}" (Simp: ${simplifiedTitle})`);
        }
    }
}

linkAudioFiles();
