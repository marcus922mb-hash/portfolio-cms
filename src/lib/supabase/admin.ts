import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAdminEnv } from "@/lib/supabase/env";

// Only import this in Server Actions or API routes.
// Never expose the service role key to the browser.
export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  return createClient<Database>(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
