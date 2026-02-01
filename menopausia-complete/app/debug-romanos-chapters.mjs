
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
// Try to get from process.env first
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in process.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRomanosChapters() {
    console.log('🔍 Checking chapters for Romanos (ES)...');

    const { data, error } = await supabase
        .from('chapters')
        .select('title, pdf_url, audio_url')
        .eq('product_id', 'letter-romanos')
        .eq('language', 'es')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('❌ Error fetching chapters:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} chapters for Romanos (ES):`);
        data.forEach((chapter, index) => {
            console.log(`\n📄 Chapter ${index + 1}: ${chapter.title}`);
            console.log(`   PDF: ${chapter.pdf_url}`);
            console.log(`   Audio: ${chapter.audio_url}`);
        });
    } else {
        console.log('⚠️ No chapters found for Romanos in Spanish.');
    }
}

checkRomanosChapters();
