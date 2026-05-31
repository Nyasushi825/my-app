import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Vercel / .env.local に設定する公開鍵（クライアントに埋め込んで良い安全な鍵）
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 鍵が設定されていれば true。未設定なら従来どおり localStorage のみで動作する。
export const isSupabaseConfigured = Boolean(url && key);

// 未設定の場合は null を返し、アプリがクラッシュしないようにする（localStorageモード）
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, key as string)
  : null;
