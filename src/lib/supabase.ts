import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase ortami eksik. NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanimlanmali."
    );
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdmin;
}

export function getTeamImagesBucket(): string {
  return process.env.SUPABASE_TEAM_IMAGES_BUCKET || "team-images";
}
