
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://pmscpydblddkwbgkzdmw.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_SXYgsOxOIQQ3FHJZ-deSOw_ygy21P1l';
const BUCKET_NAME = 'content';

const FILES = [
    { path: 'public/bonus-enemigos.pdf', name: 'bonus-enemigos.pdf', type: 'application/pdf' },
    { path: 'public/bonus-nutrientes.pdf', name: 'bonus-nutrientes.pdf', type: 'application/pdf' },
    { path: 'public/bonus-ritmo.pdf', name: 'bonus-ritmo.pdf', type: 'application/pdf' },
    { path: 'public/bonus-fuerza.pdf', name: 'bonus-fuerza.pdf', type: 'application/pdf' }
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function upload() {
    console.log('🚀 Uploading 4 Bonuses...');

    for (const file of FILES) {
        try {
            const content = fs.readFileSync(file.path);
            const { error } = await supabase.storage.from(BUCKET_NAME).upload(file.name, content, {
                contentType: file.type,
                upsert: true
            });

            if (error) console.error(`❌ Error ${file.name}:`, error.message);
            else {
                const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
                console.log(`✅ ${file.name} -> ${data.publicUrl}`);
            }
        } catch (e) {
            console.error(`❌ File error ${file.name}:`, e.message);
        }
    }
}

upload();
