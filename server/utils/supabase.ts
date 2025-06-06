import { createClient } from '@supabase/supabase-js';
import { Database } from '~~/types/database.types';

const config = useRuntimeConfig();
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
