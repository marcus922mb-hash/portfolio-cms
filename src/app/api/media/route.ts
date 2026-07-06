import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const media = await db.media.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(media)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, filename, altText, mimeType, size } = body
    if (!url || !filename) {
      return NextResponse.json({ error: 'URL i nazwa pliku są wymagane' }, { status: 400 })
    }
    const media = await db.media.create({
      data: { url, filename, altText: altText || null, mimeType: mimeType || 'image/*', size: size ?? 0 },
    })
    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('POST /api/media error:', error)
    return NextResponse.json({ error: 'Nie udało się dodać mediów' }, { status: 500 })
  }
}
