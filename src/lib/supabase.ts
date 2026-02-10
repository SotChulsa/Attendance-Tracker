import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env['PUBLIC_URL'] as string;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_KEY'] as string;
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] as string;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);