import { createClient } from "@supabase/supabase-js";

// Production fallback values verified for the active TITAN OS Supabase instance
const FALLBACK_SUPABASE_URL = "https://qilzomotjhchwnvyswba.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "sb_publishable_vNMKzPG1pwFq7scMryVIYw_GpquaAc5";

// Guard against defunct/dead project URL or key that causes ERR_NAME_NOT_RESOLVED or auth failure
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isDefunctUrl =
  !rawUrl ||
  rawUrl.includes("oyspfxzkuugktxgqkyze") ||
  rawUrl.includes("placeholder") ||
  !rawUrl.includes("qilzomotjhchwnvyswba");

const isDefunctKey =
  !rawKey ||
  rawKey.includes("oyspfxzkuugktxgqkyze") ||
  rawKey.includes("placeholder") ||
  rawKey.startsWith("eyJ") ||
  !rawKey.startsWith("sb_publishable_");

const supabaseUrl = isDefunctUrl ? FALLBACK_SUPABASE_URL : rawUrl;
const supabaseAnonKey = isDefunctKey ? FALLBACK_SUPABASE_ANON_KEY : rawKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});