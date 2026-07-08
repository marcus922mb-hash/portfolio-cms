export type EmailProvider = "resend";

export type DemoEmailLog = {
  id: string;
  created_at: string;
  client_id: string | null;
  demo_id: string | null;
  to_email: string;
  subject: string;
  body: string | null;
  provider: EmailProvider;
  status: "pending" | "sent" | "failed";
  error: string | null;
};

export type SendDemoEmailInput = {
  demoId: string;
  toEmail: string;
  subject: string;
  body: string;
};

export type SendDemoEmailActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

function normalizedAppUrl() {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  return base.replace(/\/+$/, "");
}

export function buildDemoPublicUrl(slug: string) {
  const base = normalizedAppUrl();
  return base ? `${base}/demo/${slug}` : `/demo/${slug}`;
}

export function getDefaultDemoEmailSubject(companyName?: string | null) {
  return companyName?.trim() ? `Demo strony dla ${companyName.trim()}` : "Demo strony internetowej";
}

export function getDefaultDemoEmailBody(publicUrl: string) {
  return `Dzień dobry,

przygotowałem wstępny podgląd strony internetowej, który pokazuje możliwy kierunek wizualny i układ projektu.

Demo można zobaczyć tutaj:
${publicUrl}

To nie jest jeszcze końcowa wersja strony, ale propozycja kierunku, którą możemy wspólnie dopracować.

Po obejrzeniu proszę o informację, czy taki styl odpowiada, albo jakie elementy warto zmienić.

Pozdrawiam,
MA Atelier Studio
web.ma-atelier.pl`;
}
