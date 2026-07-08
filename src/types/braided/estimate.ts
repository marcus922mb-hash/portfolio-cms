import type { EstimateRow, EstimateStatus } from "./database";

export type { EstimateStatus };

// Domain model — matches estimates table
export type Estimate = EstimateRow;

export type EstimateInsert = {
  client_id?: string;
  website_type: string;
  pages_count?: number;
  needs_wordpress?: boolean;
  needs_woocommerce?: boolean;
  needs_nextjs?: boolean;
  needs_seo?: boolean;
  needs_ai?: boolean;
  base_price?: number;
  final_price?: number;
  status?: EstimateStatus;
  notes?: string;
};
