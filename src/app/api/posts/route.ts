import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const categoryId = searchParams.get('categoryId')
  const tagId = searchParams.get('tagId')

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (categoryId) where.categoryId = categoryId
  if (tagId) where.tags = { some: { tagId } }

  const posts = await db.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true, revisions: true } },
    },
  })

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, featuredImage, status, authorName, categoryId, publishedAt, scheduledAt, metaTitle, metaDescription, ogImage, canonicalUrl, tagIds } = body

    if (!title || !excerpt) {
      return NextResponse.json({ error: 'Tytuł i zajawka są wymagane' }, { status: 400 })
    }

    const finalSlug = slug || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        tags: tagIds?.length ? { create: tagIds.map((tagId: string) => ({ tagId })) } : undefined,
      },
      include: { category: true, tags: { include: { tag: true } } },
    })

    // Save initial revision
    await db.revision.create({
      data: { postId: post.id, title, excerpt, content: content ?? '', createdBy: authorName ?? 'Admin' },
    })

    await logActivity({ action: 'create', entity: 'post', entityId: post.id, details: `Utworzono wpis: ${title}` })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć wpisu' }, { status: 500 })
  }
}
