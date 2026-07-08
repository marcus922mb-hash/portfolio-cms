import { Resend } from "resend";

type SendResendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Brakuje RESEND_API_KEY. Uzupełnij konfigurację w .env.local.");
  }

  return new Resend(apiKey);
}

function getEmailFrom() {
  const emailFrom = process.env.EMAIL_FROM?.trim();

  if (!emailFrom) {
    throw new Error("Brakuje EMAIL_FROM. Uzupełnij konfigurację w .env.local.");
  }

  return emailFrom;
}

export async function sendResendEmail({ to, subject, html, text }: SendResendEmailInput) {
  const resend = getResendClient();
  const from = getEmailFrom();
  const replyTo = process.env.EMAIL_REPLY_TO?.trim() || undefined;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
    ...(replyTo ? { reply_to: replyTo } : {}),
  });

  if (error) {
    throw new Error(error.message || "Resend zwrócił błąd podczas wysyłki wiadomości.");
  }

  if (!data?.id) {
    throw new Error("Resend nie zwrócił identyfikatora wysłanej wiadomości.");
  }

  return data;
}
