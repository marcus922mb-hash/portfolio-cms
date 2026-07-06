import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const categoryId = searchParams.get('categoryId')

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (categoryId) where.categoryId = categoryId

  const posts = await db.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { category: true, _count: { select: { comments: true } } },
  })

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, featuredImage, status, authorName, categoryId, publishedAt } = body

    if (!title || !excerpt) {
      return NextResponse.json({ error: 'Tytuł i zajawka są wymagane' }, { status: 400 })
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const post = await db.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content: content ?? '',
        featuredImage: featuredImage || null,
        status: status ?? 'published',
        authorName: authorName ?? 'Admin',
        categoryId: categoryId || null,
        publishedAt: publishedAt ? new Date(publishedAt) : (status === 'published' ? new Date() : null),
      },
      include: { category: true },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć wpisu' }, { status: 500 })
  }
}
