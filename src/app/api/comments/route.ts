import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const postId = searchParams.get('postId')

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status
  if (postId) where.postId = postId

  const comments = await db.comment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { id: true, title: true, slug: true } } },
  })
  return NextResponse.json(comments)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, authorName, authorEmail, content, status } = body
    if (!postId || !authorName || !content) {
      return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 })
    }
    const comment = await db.comment.create({
      data: {
        postId,
        authorName,
        authorEmail: authorEmail || '',
        content,
        status: status ?? 'pending',
      },
      include: { post: { select: { id: true, title: true, slug: true } } },
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('POST /api/comments error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć komentarza' }, { status: 500 })
  }
}
