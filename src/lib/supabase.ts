import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables are present and don't look like placeholders
const isValidConfig = (url: string | undefined, key: string | undefined) => {
  if (!url || !key) return false;
  if (url === 'YOUR_SUPABASE_URL' || key === 'YOUR_SUPABASE_ANON_KEY') return false;
  if (!url.startsWith('https://')) return false;
  return true;
};

export const supabase = isValidConfig(supabaseUrl, supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
