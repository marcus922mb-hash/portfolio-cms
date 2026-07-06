import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export async function GET() {
  const tags = await db.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  })
  return NextResponse.json(tags)
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json()
    if (!name) return NextResponse.json({ error: 'Nazwa jest wymagana' }, { status: 400 })
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const tag = await db.tag.create({ data: { name, slug, color: color || '#6b7280' } })
    await logActivity({ action: 'create', entity: 'tag', entityId: tag.id, details: `Utworzono tag: ${name}` })
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('POST /api/tags error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć tagu' }, { status: 500 })
  }
}
