export const dynamic = 'force-static'

export async function GET() {
  const txt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://my-project-mu-ebon.vercel.app/api/sitemap
`
  return new Response(txt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
