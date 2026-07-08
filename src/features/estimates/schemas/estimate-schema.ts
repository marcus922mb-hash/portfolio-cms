import { z } from "zod";
import { WEBSITE_TYPES } from "@/config/pricing";
import { ESTIMATE_STATUSES } from "@/features/estimates/types";

const boolCheckbox = z.preprocess((v) => v === "on", z.boolean());

export const estimateSchema = z.object({
  client_id: z.string().uuid("Wybierz klienta."),

  website_type: z.enum(WEBSITE_TYPES),

  pages_count: z.coerce
    .number()
    .int()
    .min(1, "Minimum 1 podstrona.")
    .max(999)
    .default(1),

  needs_wordpress:    boolCheckbox,
  needs_woocommerce:  boolCheckbox,
  needs_nextjs:       boolCheckbox,
  needs_seo:          boolCheckbox,
  needs_ai:           boolCheckbox,
  needs_copywriting:  boolCheckbox,
  needs_branding:     boolCheckbox,
  needs_maintenance:  boolCheckbox,

  base_price: z.coerce
    .number()
    .min(0, "Cena nie może być ujemna."),

  final_price: z.coerce
    .number()
    .min(0, "Cena nie może być ujemna."),

  status: z.enum(ESTIMATE_STATUSES).default("draft"),

  notes: z.string().max(5000).optional().transform((v) => v?.trim() ?? ""),
});

export type EstimateSchemaOutput = z.output<typeof estimateSchema>;
