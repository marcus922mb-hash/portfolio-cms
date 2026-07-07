import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  if (!q.trim()) return NextResponse.json({ posts: [], projects: [], pages: [] })

  const query = q.toLowerCase()
  const [posts, projects, pages] = await Promise.all([
    db.post.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    db.project.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    db.page.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return NextResponse.json({ posts, projects, pages, query })
}
