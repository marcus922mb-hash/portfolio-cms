import type { DemoRow, DemoSectionRow, DemoStatus } from "./database";

export type { DemoStatus };

// Domain models — match demos / demo_sections tables
export type Demo = DemoRow;
export type DemoSection = DemoSectionRow;

export type DemoInsert = {
  slug: string;
  title: string;
  client_id?: string;
  estimate_id?: string;
  industry?: string;
  style?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  status?: DemoStatus;
  is_active?: boolean;
  expires_at?: string;
};
