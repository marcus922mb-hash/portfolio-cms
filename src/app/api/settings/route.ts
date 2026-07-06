import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const settings = await db.setting.findMany()
  const obj: Record<string, string> = {}
  for (const s of settings) obj[s.key] = s.value
  return NextResponse.json(obj)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, string>
    const results = []
    for (const [key, value] of Object.entries(body)) {
      const s = await db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
      results.push(s)
    }
    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('PUT /api/settings error:', error)
    return NextResponse.json({ error: 'Nie udało się zapisać ustawień' }, { status: 500 })
  }
}
