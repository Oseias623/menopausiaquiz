
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://pmscpydblddkwbgkzdmw.supabase.co';
// Using the SERVICE key provided by the user for admin privileges (upload bypassing RLS if needed)
const SUPABASE_SERVICE_KEY = 'sb_secret_SXYgsOxOIQQ3FHJZ-deSOw_ygy21P1l';

const BUCKET_NAME = 'content'; // We'll try to use a 'content' bucket

const FILES_TO_UPLOAD = [
    {
        filePath: 'public/programa-antiinflamatorio.pdf',
        fileName: 'programa-antiinflamatorio.pdf',
        contentType: 'application/pdf'
    },
    {
        filePath: 'public/recetas-menopausia.pdf',
        fileName: 'recetas-menopausia.pdf',
        contentType: 'application/pdf'
    }
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadFiles() {
    console.log('🚀 Starting upload to Supabase...');

    // 1. Ensure bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error('❌ Error listing buckets:', listError.message);
        // Try creating it anyway if listing fails due to permissions (though service key should have access)
    }

    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
        console.log(`📦 Bucket '${BUCKET_NAME}' not found. Creating...`);
        const { data: bucket, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true, // Make it public so we can download easily
            fileSizeLimit: 52428800, // 50MB
            allowedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a']
        });

        if (createError) {
            console.error('❌ Error creating bucket:', createError.message);
            // Fallback to 'public' or something if it fails?
            return;
        }
        console.log('✅ Bucket created.');
    } else {
        console.log(`✅ Bucket '${BUCKET_NAME}' exists.`);
    }

    // 2. Upload Files
    for (const file of FILES_TO_UPLOAD) {
        try {
            const fileContent = fs.readFileSync(file.filePath);
            console.log(`📤 Uploading ${file.fileName}...`);

            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(file.fileName, fileContent, {
                    contentType: file.contentType,
                    upsert: true
                });

            if (error) {
                console.error(`❌ Failed to upload ${file.fileName}:`, error.message);
            } else {
                console.log(`✅ Uploaded ${file.fileName}`);

                // Get Public URL
                const { data: urlData } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(file.fileName);

                console.log(`🔗 URL: ${urlData.publicUrl}`);
            }

        } catch (err) {
            console.error(`❌ File system error for ${file.filePath}:`, err.message);
        }
    }
}

uploadFiles();
