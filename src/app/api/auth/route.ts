import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// POST /api/auth/login - simple session via cookie
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email i hasło są wymagane' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Nieprawidłowy email lub hasło' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Nieprawidłowy email lub hasło' }, { status: 401 })
    }

    await db.activityLog.create({
      data: { userId: user.id, userName: user.name, action: 'login', entity: 'auth', entityId: user.id },
    })

    const res = NextResponse.json({
      id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar,
    })
    // Simple session: store user ID in HTTP-only cookie (1 day)
    res.cookies.set('cms_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return res
  } catch (error) {
    console.error('POST /api/auth error:', error)
    return NextResponse.json({ error: 'Błąd logowania' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { getSession } = await import('@/lib/auth')
    const user = await getSession()
    if (!user) return NextResponse.json({ authenticated: false })
    return NextResponse.json({
      authenticated: true,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}

// DELETE /api/auth - logout
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('cms_session')
  return res
}
