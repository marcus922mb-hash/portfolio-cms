import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const entity = searchParams.get('entity')

  const where: Record<string, unknown> = {}
  if (entity) where.entity = entity

  const logs = await db.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return NextResponse.json(logs)
}
