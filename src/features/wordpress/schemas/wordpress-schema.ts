import { z } from "zod";
import { WP_AUTH_TYPES } from "@/features/wordpress/types";

export const wordPressConnectionSchema = z.object({
  client_id: z.string().uuid("Wybierz klienta.").or(z.literal("")).optional(),
  name: z.string().trim().max(120).optional(),
  site_url: z
    .string()
    .trim()
    .min(1, "Adres strony jest wymagany.")
    .url("Podaj poprawny URL strony WordPress, np. https://example.com"),
  api_base_url: z
    .string()
    .trim()
    .url("Podaj poprawny URL endpointu API.")
    .or(z.literal(""))
    .optional(),
  auth_type: z.enum(WP_AUTH_TYPES).default("application_password"),
  username: z.string().trim().max(120).optional(),
  application_password: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type WordPressConnectionFormInput = z.infer<typeof wordPressConnectionSchema>;
