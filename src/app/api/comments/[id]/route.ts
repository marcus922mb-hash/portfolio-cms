import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const comment = await db.comment.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.content !== undefined && { content: body.content }),
      },
      include: { post: { select: { id: true, title: true } } },
    })
    return NextResponse.json(comment)
  } catch (error) {
    console.error('PUT /api/comments/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.comment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/comments/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
