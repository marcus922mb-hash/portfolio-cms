import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const sub = await db.contactSubmission.update({
      where: { id },
      data: { ...(body.status !== undefined && { status: body.status }) },
    })
    return NextResponse.json(sub)
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.contactSubmission.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
