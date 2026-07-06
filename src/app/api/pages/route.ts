import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const pages = await db.page.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(pages)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, featuredImage, status, order, showInMenu } = body
    if (!title || !content) {
      return NextResponse.json({ error: 'Tytuł i treść są wymagane' }, { status: 400 })
    }
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const page = await db.page.create({
      data: {
        title, slug: finalSlug, content,
        featuredImage: featuredImage || null,
        status: status ?? 'published',
        order: order ?? 0,
        showInMenu: showInMenu ?? true,
      },
    })
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('POST /api/pages error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć strony' }, { status: 500 })
  }
}
