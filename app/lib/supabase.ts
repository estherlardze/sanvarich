import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jdtbjuutqinutwbmksnt.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdGJqdXV0cWludXR3Ym1rc250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzU4MTUsImV4cCI6MjA3OTkxMTgxNX0.PhG1mgZXjllucay7cOjTCSMSchORwQg5xX-TNk_E5js";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};
