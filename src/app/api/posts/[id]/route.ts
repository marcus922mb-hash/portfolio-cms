import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logActivity } from '@/lib/activity'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const post = await db.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
      comments: { orderBy: { createdAt: 'desc' } },
      revisions: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })
  if (!post) return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()

    // Save current as revision before update
    const current = await db.post.findUnique({ where: { id } })
    if (current) {
      await db.revision.create({
        data: {
          postId: id,
          title: current.title,
          excerpt: current.excerpt,
          content: current.content,
          createdBy: body.authorName || 'Admin',
        },
      })
    }

    // Update tags if provided
    if (body.tagIds !== undefined) {
      await db.postTag.deleteMany({ where: { postId: id } })
      if (body.tagIds.length > 0) {
        await db.postTag.createMany({ data: body.tagIds.map((tagId: string) => ({ postId: id, tagId })) })
      }
    }

    const post = await db.post.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage || null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.authorName !== undefined && { authorName: body.authorName }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId || null }),
        ...(body.publishedAt !== undefined && { publishedAt: body.publishedAt ? new Date(body.publishedAt) : null }),
        ...(body.scheduledAt !== undefined && { scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle || null }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription || null }),
        ...(body.ogImage !== undefined && { ogImage: body.ogImage || null }),
        ...(body.canonicalUrl !== undefined && { canonicalUrl: body.canonicalUrl || null }),
      },
      include: { category: true, tags: { include: { tag: true } } },
    })

    await logActivity({ action: 'update', entity: 'post', entityId: id, details: `Zaktualizowano wpis: ${post.title}` })
    return NextResponse.json(post)
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const post = await db.post.findUnique({ where: { id }, select: { title: true } })
    await db.post.delete({ where: { id } })
    await logActivity({ action: 'delete', entity: 'post', entityId: id, details: `Usunięto wpis: ${post?.title || id}` })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
