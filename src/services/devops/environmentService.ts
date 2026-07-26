export interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isProduction: boolean;
  appVersion: string;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "https://placeholder-supabase.supabase.co",
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key",
    isProduction: import.meta.env.PROD || false,
    appVersion: "1.0.0-RC",
  };
}
