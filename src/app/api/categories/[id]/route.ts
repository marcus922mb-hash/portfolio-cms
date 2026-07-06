import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const { name, color } = await request.json()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const category = await db.category.update({ where: { id }, data: { name, slug, color: color || '#6b7280' } })
    return NextResponse.json(category)
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
