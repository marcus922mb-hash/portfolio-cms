import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json()
    if (!name) return NextResponse.json({ error: 'Nazwa jest wymagana' }, { status: 400 })
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const category = await db.category.create({ data: { name, slug, color: color || '#6b7280' } })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('POST /api/categories error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć kategorii' }, { status: 500 })
  }
}
