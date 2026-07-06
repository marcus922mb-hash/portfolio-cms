import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logActivity } from '@/lib/activity'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const { name, color } = await request.json()
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const tag = await db.tag.update({ where: { id }, data: { name, slug, color: color || '#6b7280' } })
    await logActivity({ action: 'update', entity: 'tag', entityId: id, details: `Zaktualizowano tag: ${name}` })
    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.tag.delete({ where: { id } })
    await logActivity({ action: 'delete', entity: 'tag', entityId: id })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
