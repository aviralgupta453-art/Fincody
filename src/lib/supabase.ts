import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ltrljscjhbrvwvmqwidh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_T8A6kVYBHvQbhhvwRup_4g_WYDRkV-Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
