import { createClient } from '@supabase/supabase-js';
import { Database } from '~~/types/database.types';

const config = useRuntimeConfig();
const supabaseUrl = config.supabaseUrl;
const supabaseRoleKey = config.supabaseRoleKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseRoleKey);
