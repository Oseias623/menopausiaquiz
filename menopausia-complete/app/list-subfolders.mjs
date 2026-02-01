import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://dtpydjllcreeibrrtcna.supabase.co',
    process.env.VITE_SUPABASE_KEY || 'sb_publishable_Du4l7tg57DRue_GacJPOvw_tnZgrjAu'
);

async function listSubfolders() {
    console.log('📂 Listando subpastas...\n');

    const folders = ['translated', 'traslated'];

    for (const folder of folders) {
        console.log(`--- Pasta: ${folder} ---`);
        const { data } = await supabase.storage
            .from('audios')
            .list(folder);

        if (data && data.length > 0) {
            data.forEach(f => console.log(`   ${f.name}`));
        } else {
            console.log('   (Vazia)');
        }
        console.log('');
    }
}

listSubfolders();
