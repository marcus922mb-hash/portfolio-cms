import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  if (!postId) return NextResponse.json({ error: 'postId wymagane' }, { status: 400 })

  const revisions = await db.revision.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(revisions)
}

// Restore revision
export async function POST(request: NextRequest) {
  try {
    const { revisionId, postId } = await request.json()
    const revision = await db.revision.findUnique({ where: { id: revisionId } })
    if (!revision) return NextResponse.json({ error: 'Nie znaleziono rewizji' }, { status: 404 })

    // Save current state as new revision
    const current = await db.post.findUnique({ where: { id: postId } })
    if (current) {
      await db.revision.create({
        data: {
          postId,
          title: current.title,
          excerpt: current.excerpt,
          content: current.content,
          createdBy: 'Admin',
        },
      })
    }

    // Restore
    const restored = await db.post.update({
      where: { id: postId },
      data: {
        title: revision.title,
        excerpt: revision.excerpt,
        content: revision.content,
      },
    })
    return NextResponse.json(restored)
  } catch (error) {
    console.error('POST /api/revisions error:', error)
    return NextResponse.json({ error: 'Nie udało się przywrócić' }, { status: 500 })
  }
}
