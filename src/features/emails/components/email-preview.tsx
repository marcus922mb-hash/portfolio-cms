"use client";

type Props = {
  toEmail: string;
  subject: string;
  body: string;
  publicUrl: string;
};

export function EmailPreview({ toEmail, subject, body, publicUrl }: Props) {
  return (
    <div className="email-preview">
      <div className="email-preview-bar">
        <span />
        <span />
        <span />
        <b>Podgląd wiadomości</b>
      </div>

      <div className="email-preview-body">
        <div className="email-preview-meta">
          <div>
            <small>Do</small>
            <strong>{toEmail || "Brak adresu e-mail"}</strong>
          </div>
          <div>
            <small>Temat</small>
            <strong>{subject || "Brak tematu"}</strong>
          </div>
        </div>

        <div className="email-preview-copy">
          {body.split("\n").map((line, index) => (
            <p key={`${line}-${index}`}>{line || "\u00A0"}</p>
          ))}
        </div>

        <div className="email-preview-link-box">
          <small>Link do demo</small>
          <a href={publicUrl} target="_blank" rel="noreferrer">
            {publicUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
