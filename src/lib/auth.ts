import { cookies } from 'next/headers'
import { db } from './db'
import type { User } from '@prisma/client'

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('cms_session')?.value
  if (!sessionId) return null

  const user = await db.user.findUnique({
    where: { id: sessionId },
  })
  return user
}

export async function requireAuth(): Promise<User> {
  const user = await getSession()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
