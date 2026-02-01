
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Credentials from lib/supabaseClient.ts
const SUPABASE_URL = 'https://pmscpydblddkwbgkzdmw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g3qVdfbiJo942PAs-V-zqA_S8HKfivc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function upload() {
    const bonusDir = './BÔNUS'; // Normalized usually
    console.log(`Looking in ${bonusDir}...`);

    if (!fs.existsSync(bonusDir)) {
        console.log('Trying non-unicode path name just in case...');
    }

    // List files to find the match
    const files = fs.readdirSync('.');
    const bonusFolder = files.find(f => f.normalize('NFD').includes('BO') && f.normalize('NFD').includes('NUS'));

    if (!bonusFolder) {
        console.error('Could not find BONUS folder');
        process.exit(1);
    }

    console.log(`Found folder: ${bonusFolder}`);
    const pdfs = fs.readdirSync(bonusFolder);

    // Look for the "compressed" file which seems to be the new one
    const targetFile = pdfs.find(f => f.includes('Recetas') && f.includes('compressed') && f.endsWith('.pdf'));

    if (!targetFile) {
        console.error('Target PDF not found in folder.');
        console.log('Available files:', pdfs);
        process.exit(1);
    }

    console.log(`Found file: ${targetFile}`);

    const fullPath = path.join(bonusFolder, targetFile);
    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = 'recetas-menopausia-parte2.pdf'; // Clean name

    console.log(`Uploading to Supabase storage as ${fileName}...`);

    const { data, error } = await supabase.storage
        .from('content')
        .upload(fileName, fileBuffer, {
            contentType: 'application/pdf',
            upsert: true
        });

    if (error) {
        console.error('Upload error:', error);
    } else {
        console.log('Upload success!');
        const { data: publicData } = supabase.storage.from('content').getPublicUrl(fileName);
        console.log('PUBLIC_URL:', publicData.publicUrl);
    }
}

upload();
