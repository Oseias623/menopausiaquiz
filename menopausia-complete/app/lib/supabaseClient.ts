
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pmscpydblddkwbgkzdmw.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_g3qVdfbiJo942PAs-V-zqA_S8HKfivc';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Using fallback Supabase credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);