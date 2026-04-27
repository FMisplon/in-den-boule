import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function createSupabaseServerClient() {
  if (!env.supabaseSecretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY");
  }

  return createClient(env.supabaseUrl, env.supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
