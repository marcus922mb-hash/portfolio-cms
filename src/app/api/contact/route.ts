import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status

  const submissions = await db.contactSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(submissions)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Imię, email i wiadomość są wymagane' }, { status: 400 })
    }
    const sub = await db.contactSubmission.create({
      data: { name, email, subject: subject || 'Brak tematu', message },
    })
    return NextResponse.json(sub, { status: 201 })
  } catch (error) {
    console.error('POST /api/contact error:', error)
    return NextResponse.json({ error: 'Nie udało się wysłać' }, { status: 500 })
  }
}
