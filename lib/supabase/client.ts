// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;  // Use PUBLISHABLE key

  if (!url || !key) {
    console.error('Missing Supabase environment variables');
    return {} as any;
  }

  return createBrowserClient(url, key);
}


