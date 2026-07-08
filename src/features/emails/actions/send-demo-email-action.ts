"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { buildSendDemoEmailHtml } from "@/lib/email/templates/send-demo-email";
import { sendResendEmail } from "@/lib/email/resend";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import {
  buildDemoPublicUrl,
  type SendDemoEmailActionState,
  type SendDemoEmailInput,
} from "@/features/emails/types";

const sendDemoEmailSchema = z.object({
  demoId: z.string().uuid(),
  toEmail: z.string().trim().email("Podaj poprawny adres e-mail."),
  subject: z.string().trim().min(1, "Temat wiadomości jest wymagany.").max(200),
  body: z.string().trim().min(1, "Treść wiadomości jest wymagana.").max(5000),
});

const logDemoLinkCopySchema = z.object({
  demoId: z.string().uuid(),
});

async function requireUser() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Brak dostępu. Zaloguj się ponownie.");
  }

  return supabase;
}

export async function logDemoLinkCopiedAction(input: {
  demoId: string;
}): Promise<void> {
  const parsed = logDemoLinkCopySchema.safeParse(input);
  if (!parsed.success) return;

  try {
    const supabase = await requireUser();
    await supabase.from("activity_logs").insert({
      entity_type: "demo",
      entity_id: parsed.data.demoId,
      action: "demo_link_copied",
      description: "Skopiowano link do demo",
    });
  } catch {
    // Best effort logging only.
  }
}

export async function sendDemoEmailAction(
  input: SendDemoEmailInput
): Promise<SendDemoEmailActionState> {
  const parsed = sendDemoEmailSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Uzupełnij poprawnie adres e-mail, temat i treść wiadomości." };
  }

  let demoIdForErrorLog: string | null = null;

  try {
    const supabase = await requireUser();
    demoIdForErrorLog = parsed.data.demoId;

    const { data: demo, error: demoError } = await supabase
      .from("demos")
      .select("id, client_id, slug, status, title")
      .eq("id", parsed.data.demoId)
      .single();

    if (demoError || !demo) {
      return { success: false, error: "Nie znaleziono demo." };
    }

    const publicUrl = buildDemoPublicUrl(demo.slug);
    const now = new Date().toISOString();
    const html = buildSendDemoEmailHtml({
      subject: parsed.data.subject,
      body: parsed.data.body,
      publicUrl,
    });

    try {
      await sendResendEmail({
        to: parsed.data.toEmail,
        subject: parsed.data.subject,
        html,
        text: parsed.data.body,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nie udało się wysłać wiadomości e-mail.";

      await supabase.from("email_logs").insert({
        client_id: demo.client_id,
        demo_id: demo.id,
        to_email: parsed.data.toEmail,
        subject: parsed.data.subject,
        body: parsed.data.body,
        provider: "resend",
        status: "failed",
        error: message,
      });

      await supabase.from("activity_logs").insert({
        entity_type: "demo",
        entity_id: demo.id,
        action: "demo_email_failed",
        description: "Błąd wysyłki demo",
        metadata: { to_email: parsed.data.toEmail, error: message },
      });

      return { success: false, error: message };
    }

    const nextStatus = demo.status === "draft" || demo.status === "generated" ? "sent" : demo.status;

    await supabase.from("email_logs").insert({
      client_id: demo.client_id,
      demo_id: demo.id,
      to_email: parsed.data.toEmail,
      subject: parsed.data.subject,
      body: parsed.data.body,
      provider: "resend",
      status: "sent",
      error: null,
    });

    await supabase
      .from("demos")
      .update({
        status: nextStatus,
        sent_at: now,
      })
      .eq("id", demo.id);

    await supabase.from("activity_logs").insert({
      entity_type: "demo",
      entity_id: demo.id,
      action: "demo_email_sent",
      description: "Wysłano demo e-mailem",
      metadata: {
        to_email: parsed.data.toEmail,
        subject: parsed.data.subject,
        previous_status: demo.status,
        status: nextStatus,
      },
    });

    revalidatePath(`/panel/demo/${demo.id}`);
    revalidatePath("/panel/demo");
    revalidatePath(`/demo/${demo.slug}`);

    return { success: true, message: "Demo zostało wysłane e-mailem." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udało się wysłać demo e-mailem.";

    if (demoIdForErrorLog) {
      try {
        const supabase = await createSupabaseClient();
        await supabase.from("activity_logs").insert({
          entity_type: "demo",
          entity_id: demoIdForErrorLog,
          action: "demo_email_failed",
          description: "Błąd wysyłki demo",
          metadata: { error: message },
        });
      } catch {
        // Best effort logging only.
      }
    }

    return { success: false, error: message };
  }
}
