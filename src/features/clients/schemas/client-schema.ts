import { z } from "zod";
import { CLIENT_STATUSES } from "@/features/clients/types";

export const clientSchema = z
  .object({
    first_name: z
      .string()
      .max(100, "Imię może mieć maksymalnie 100 znaków")
      .optional()
      .transform((v) => v?.trim() ?? ""),
    last_name: z
      .string()
      .max(100, "Nazwisko może mieć maksymalnie 100 znaków")
      .optional()
      .transform((v) => v?.trim() ?? ""),
    company_name: z
      .string()
      .max(200, "Nazwa firmy może mieć maksymalnie 200 znaków")
      .optional()
      .transform((v) => v?.trim() ?? ""),
    email: z
      .string()
      .max(200)
      .optional()
      .transform((v) => v?.trim().toLowerCase() ?? ""),
    phone: z
      .string()
      .max(30, "Telefon może mieć maksymalnie 30 znaków")
      .optional()
      .transform((v) => v?.trim() ?? ""),
    industry: z
      .string()
      .max(100)
      .optional()
      .transform((v) => v?.trim() ?? ""),
    city: z
      .string()
      .max(100)
      .optional()
      .transform((v) => v?.trim() ?? ""),
    website_url: z
      .string()
      .max(500)
      .optional()
      .transform((v) => v?.trim() ?? ""),
    social_linkedin: z
      .string()
      .max(300)
      .optional()
      .transform((v) => v?.trim() ?? ""),
    social_facebook: z
      .string()
      .max(300)
      .optional()
      .transform((v) => v?.trim() ?? ""),
    social_instagram: z
      .string()
      .max(300)
      .optional()
      .transform((v) => v?.trim() ?? ""),
    notes: z
      .string()
      .max(5000, "Notatka może mieć maksymalnie 5000 znaków")
      .optional()
      .transform((v) => v ?? ""),
    status: z.enum(CLIENT_STATUSES).default("new"),
  })
  .superRefine((data, ctx) => {
    if (!data.first_name && !data.company_name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Imię lub nazwa firmy jest wymagana",
        path: ["first_name"],
      });
    }
    if (data.email) {
      const emailOk = z.string().email().safeParse(data.email);
      if (!emailOk.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nieprawidłowy format e-mail",
          path: ["email"],
        });
      }
    }
    if (data.website_url) {
      const urlOk = z.string().url().safeParse(data.website_url);
      if (!urlOk.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nieprawidłowy URL — przykład: https://example.com",
          path: ["website_url"],
        });
      }
    }
  });

export type ClientSchemaOutput = z.infer<typeof clientSchema>;

export const noteSchema = z.object({
  content: z.string().min(1, "Treść notatki jest wymagana").max(5000),
});
