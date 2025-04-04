import { createClient } from '@supabase/supabase-js';

const config = useRuntimeConfig();
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
