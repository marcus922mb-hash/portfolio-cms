export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function formatWPDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL");
}
