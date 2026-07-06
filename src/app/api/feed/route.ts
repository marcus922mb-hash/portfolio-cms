import { db } from '@/lib/db'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await db.post.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: { category: true },
  })

  const siteUrl = 'https://my-project-mu-ebon.vercel.app'
  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/?view=blog/${p.slug}</link>
      <guid>${siteUrl}/?view=blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.publishedAt || p.createdAt).toUTCString()}</pubDate>
      ${p.category ? `<category>${p.category.name}</category>` : ''}
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Portfolio CMS</title>
    <link>${siteUrl}</link>
    <description>Blog</description>
    <language>pl-PL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
