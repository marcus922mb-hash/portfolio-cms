import type { LeadSubmission } from "./types";

export async function sendLeadNotification(submission: LeadSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[Email] RESEND_API_KEY not set — skipping email send");
    console.log("[Email] Lead summary:", {
      id: submission.id,
      project: submission.estimate.projectTypeLabel,
      price: `${submission.estimate.minPrice}–${submission.estimate.maxPrice} zł`,
      email: submission.formData.email || "—",
      submittedAt: submission.submittedAt,
    });
    return;
  }

  const ownerHtml = buildOwnerEmail(submission);
  const clientHtml = buildClientEmail(submission);

  try {
    await sendViaResend(apiKey, {
      from: "wycena@braideddigital.pl",
      to: "ma.atelier.kontakt@gmail.com",
      subject: `Nowe zgłoszenie #${submission.id.slice(-6)} — ${submission.estimate.projectTypeLabel}`,
      html: ownerHtml,
    });

    if (submission.formData.email) {
      await sendViaResend(apiKey, {
        from: "wycena@braideddigital.pl",
        to: submission.formData.email,
        subject: "Twoja wycena — Braided Digital",
        html: clientHtml,
      });
    }
  } catch (err) {
    console.error("[Email] Resend API error:", err);
  }
}

async function sendViaResend(
  apiKey: string,
  payload: { from: string; to: string; subject: string; html: string }
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

function buildOwnerEmail(s: LeadSubmission): string {
  const { formData: f, estimate: e } = s;
  return `
<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
<h2 style="color:#1a1413">Nowe zgłoszenie z kalkulatora wyceny</h2>
<table style="width:100%;border-collapse:collapse">
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">ID</td><td style="padding:8px 0;border-bottom:1px solid #eee">${s.id}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Projekt</td><td style="padding:8px 0;border-bottom:1px solid #eee">${e.projectTypeLabel}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Wycena</td><td style="padding:8px 0;border-bottom:1px solid #eee;color:#b8902e"><strong>${e.minPrice.toLocaleString("pl-PL")}–${e.maxPrice.toLocaleString("pl-PL")} zł</strong></td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Czas realizacji</td><td style="padding:8px 0;border-bottom:1px solid #eee">${e.timelineLabel}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Imię</td><td style="padding:8px 0;border-bottom:1px solid #eee">${f.name || "—"}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">E-mail</td><td style="padding:8px 0;border-bottom:1px solid #eee">${f.email || "—"}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Telefon</td><td style="padding:8px 0;border-bottom:1px solid #eee">${f.phone || "—"}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Budżet</td><td style="padding:8px 0;border-bottom:1px solid #eee">${f.budget}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Termin</td><td style="padding:8px 0;border-bottom:1px solid #eee">${f.timeline}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">Zakres</td><td style="padding:8px 0;border-bottom:1px solid #eee">${e.features.join(", ")}</td></tr>
  <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Opis</td><td style="padding:8px 0">${f.description || "—"}</td></tr>
</table>
<hr style="margin:20px 0">
<p style="font-size:12px;color:#888">Zgłoszenie z ${new Date(s.submittedAt).toLocaleString("pl-PL")} · braideddigital.pl</p>
</body></html>`;
}

function buildClientEmail(s: LeadSubmission): string {
  const { formData: f, estimate: e } = s;
  return `
<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
<h2 style="color:#1a1413">Cześć${f.name ? `, ${f.name}` : ""}!</h2>
<p>Dziękuję za uzupełnienie kalkulatora wyceny. Oto Twoje orientacyjne widełki:</p>
<div style="background:#faf5ed;border:1px solid #e0c98a;padding:24px;margin:20px 0;text-align:center">
  <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:#888">Orientacyjna cena</p>
  <p style="margin:8px 0 0;font-size:2.5rem;font-weight:bold;color:#b8902e">${e.minPrice.toLocaleString("pl-PL")}–${e.maxPrice.toLocaleString("pl-PL")} zł</p>
  <p style="margin:8px 0 0;font-size:13px;color:#666">Szacowany czas: <strong>${e.timelineLabel}</strong></p>
</div>
<p><strong>Projekt:</strong> ${e.projectTypeLabel}</p>
<p><strong>Wybrany zakres:</strong> ${e.features.filter((x) => !x.includes("ekspresowa")).join(", ")}</p>
<hr style="margin:24px 0">
<p>Skontaktuję się z Tobą w ciągu 1–2 dni roboczych, żeby omówić szczegóły i przygotować ostateczną wycenę.</p>
<p>Możesz też napisać od razu na <a href="https://wa.me/48730195530" style="color:#b8902e">WhatsApp: +48 730 195 530</a></p>
<p style="margin-top:24px">— Braided Digital</p>
<hr style="margin:20px 0">
<p style="font-size:11px;color:#bbb">Wycena ma charakter orientacyjny i nie stanowi oferty handlowej. Ostateczną cenę ustalamy po rozmowie.</p>
</body></html>`;
}
