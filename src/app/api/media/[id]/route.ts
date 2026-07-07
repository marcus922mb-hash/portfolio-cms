import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const media = await db.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 })
    }

    if (media.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', media.url)
      try { await unlink(filePath) } catch { /* file may not exist */ }
    }

    await db.media.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/media/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
