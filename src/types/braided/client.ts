import type { ClientStatus } from "./database";

// Re-export for convenience
export type { ClientStatus };

// Delegated to features/clients/types.ts for the full domain model
// This file keeps backward-compat re-exports
export type ClientInsert = {
  first_name: string;
  last_name?: string;
  email?: string | null;
  company_name?: string | null;
  phone?: string | null;
  industry?: string | null;
  city?: string | null;
  website_url?: string | null;
  notes?: string | null;
  status?: ClientStatus;
};
