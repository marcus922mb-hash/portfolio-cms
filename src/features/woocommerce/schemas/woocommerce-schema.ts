import { z } from "zod";
import { WOOCOMMERCE_CONNECTION_STATUSES } from "@/features/woocommerce/types";

export const woocommerceConnectionFormSchema = z.object({
  client_id: z.string().uuid("Wybierz klienta."),
  wordpress_connection_id: z.string().uuid().or(z.literal("")).optional(),
  name: z.string().trim().min(1, "Nazwa sklepu jest wymagana.").max(160),
  store_url: z
    .string()
    .trim()
    .min(1, "Adres sklepu jest wymagany.")
    .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
    .pipe(z.url("Podaj poprawny URL sklepu.")),
  consumer_key: z.string().trim().min(1, "Consumer Key jest wymagany.").max(255),
  consumer_secret: z.string().trim().min(1, "Consumer Secret jest wymagany.").max(255),
  status: z.enum(WOOCOMMERCE_CONNECTION_STATUSES, { message: "Wybierz poprawny status." }),
  notes: z.string().max(3000).optional(),
});

export type WooCommerceConnectionFormInput = z.infer<typeof woocommerceConnectionFormSchema>;
