import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const user = await db.user.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
      },
      select: { id: true, email: true, name: true, role: true, avatar: true, bio: true, createdAt: true },
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
