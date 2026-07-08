import { z } from "zod";
import { PROJECT_STATUSES } from "@/features/projects/types";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa projektu jest wymagana")
    .max(200, "Nazwa może mieć maksymalnie 200 znaków")
    .transform((v) => v.trim()),
  status: z.enum(PROJECT_STATUSES),
  client_id: z
    .string()
    .optional()
    .transform((v) => (v?.trim() && v !== "none" ? v : null)),
  estimate_id: z
    .string()
    .optional()
    .transform((v) => (v?.trim() && v !== "none" ? v : null)),
  start_date: z
    .string()
    .optional()
    .transform((v) => v?.trim() || null),
  deadline: z
    .string()
    .optional()
    .transform((v) => v?.trim() || null),
  technology: z
    .string()
    .max(200, "Technologia może mieć maksymalnie 200 znaków")
    .optional()
    .transform((v) => v?.trim() || null),
  notes: z
    .string()
    .max(5000)
    .optional()
    .transform((v) => v?.trim() || null),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
