import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export const isSupabaseConfigured = (): boolean => {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

  return Boolean(
    url &&
      anonKey &&
      /^https?:\/\//i.test(url) &&
      !url.includes("your-project") &&
      !url.includes("OkadzakiMenu.supabase.co") &&
      !anonKey.includes("your-supabase") &&
      !anonKey.includes("your-anon"),
  );
};

export const getSupabaseClient = (): SupabaseClient => {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
    );
  }

  client = createClient(url, anonKey);
  return client;
};
