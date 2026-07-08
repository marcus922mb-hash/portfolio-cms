type BuildSendDemoEmailTemplateInput = {
  subject: string;
  body: string;
  publicUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildSendDemoEmailHtml({
  subject,
  body,
  publicUrl,
}: BuildSendDemoEmailTemplateInput) {
  const safeSubject = escapeHtml(subject);
  const safeUrl = escapeHtml(publicUrl);
  const safeBody = escapeHtml(body).replaceAll("\n", "<br />");

  return `<!DOCTYPE html>
<html lang="pl">
  <body style="margin:0;background:#f4f0e8;color:#191815;font-family:Avenir Next,Avenir,Helvetica Neue,Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
      <div style="border:1px solid rgba(25,24,21,.08);background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 22px 60px rgba(35,31,26,.08);">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#201b16,#7e624c 52%,#d7c3a5);color:#ffffff;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.74);">MA Atelier Studio</p>
          <h1 style="margin:0;font-family:Iowan Old Style,Baskerville,Times New Roman,serif;font-size:34px;font-weight:500;line-height:1;">${safeSubject}</h1>
        </div>
        <div style="padding:28px 32px;">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#413931;">${safeBody}</p>
          <div style="margin:24px 0 18px;padding:18px;border:1px solid rgba(151,115,60,.18);border-radius:14px;background:#faf6ef;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#97733c;">Publiczny link do demo</p>
            <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#413931;word-break:break-word;">${safeUrl}</p>
            <a href="${safeUrl}" style="display:inline-block;padding:14px 18px;border-radius:999px;background:#97733c;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Otwórz demo</a>
          </div>
          <p style="margin:24px 0 0;font-size:12px;line-height:1.7;color:rgba(25,24,21,.55);">Ta wiadomość została wysłana z panelu MA Atelier Studio.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
}
