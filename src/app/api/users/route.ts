import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, avatar: true, bio: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role, bio, avatar } = await request.json()
    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Email, nazwa i hasło są wymagane' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: { email, name, password: hashed, role: role || 'editor', bio: bio || null, avatar: avatar || null },
      select: { id: true, email: true, name: true, role: true, avatar: true, bio: true, createdAt: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json({ error: 'Nie udało się utworzyć użytkownika (email może być zajęty)' }, { status: 500 })
  }
}
