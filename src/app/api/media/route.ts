import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  const media = await db.media.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(media)
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json({ error: 'Plik jest wymagany' }, { status: 400 })
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      const ext = file.name.split('.').pop() || 'bin'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), buffer)

      const url = `/uploads/${filename}`
      const media = await db.media.create({
        data: {
          url,
          filename: file.name,
          altText: (formData.get('altText') as string) || null,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
        },
      })
      return NextResponse.json(media, { status: 201 })
    }

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
