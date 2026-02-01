import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Helper to sanitize filename for URL (remove special chars if needed, but keeping simple for now)
function sanitize(name) {
    return name; // Keep original for mapping consistency or sanitize? 
    // Ideally we keep original names to match the App.tsx list, OR we update App.tsx.
    // The App expects specific filenames. I should keep them as is.
}

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_KEY,
    {
        auth: {
            persistSession: false
        }
    }
);

const INPUT_DIR = '../arsenal_staging/kit-mujer';
const BUCKET = 'pdfs';
const STORAGE_PREFIX = 'arsenal/kit-mujer'; // subfolder in bucket

async function uploadFiles() {
    console.log(`📂 Lendo arquivos de: ${INPUT_DIR}`);

    let files;
    try {
        files = readdirSync(INPUT_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
    } catch (e) {
        console.error("Erro ao ler diretório:", e.message);
        return;
    }

    console.log(`found ${files.length} pdfs.`);

    for (const file of files) {
        const filePath = join(INPUT_DIR, file);
        const stats = statSync(filePath);
        const fileSizeMB = stats.size / (1024 * 1024);

        console.log(`\n📤 Uploading ${file} (${fileSizeMB.toFixed(2)} MB)...`);

        const fileBuffer = readFileSync(filePath);
        const targetPath = `${STORAGE_PREFIX}/${file}`;

        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(targetPath, fileBuffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) {
            console.error(`   ❌ Falha: ${error.message}`);
        } else {
            console.log(`   ✅ Sucesso! Path: ${data.path}`);
            // Verify Public URL
            const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(targetPath);
            console.log(`   🔗 URL: ${publicUrl}`);
        }
    }
}

uploadFiles();
