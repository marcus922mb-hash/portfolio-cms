import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const siteUrl = process.env.NEXTAUTH_URL || 'https://my-project-mu-ebon.vercel.app'

    const [posts, projects, pages] = await Promise.all([
      db.post.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } }).catch(() => []),
      db.project.findMany({ where: { status: 'published' }, select: { id: true, updatedAt: true } }).catch(() => []),
      db.page.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } }).catch(() => []),
    ])

    const urls = [
      `<url><loc>${siteUrl}</loc><lastmod>${new Date().toISOString()}</lastmod><priority>1.0</priority></url>`,
      `<url><loc>${siteUrl}/?view=blog</loc><priority>0.9</priority></url>`,
      `<url><loc>${siteUrl}/?view=projects</loc><priority>0.9</priority></url>`,
      ...posts.map(p => `<url><loc>${siteUrl}/?view=blog/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`),
      ...projects.map(p => `<url><loc>${siteUrl}/?view=project/${p.id}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`),
      ...pages.map(p => `<url><loc>${siteUrl}/?view=page/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.6</priority></url>`),
    ].join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  } catch {
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  }
}
