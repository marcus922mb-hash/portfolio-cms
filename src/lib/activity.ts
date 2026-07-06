import { db } from '@/lib/db'

type LogParams = {
  userId?: string
  userName?: string
  action: string
  entity: string
  entityId?: string
  details?: string
  ipAddress?: string
}

export async function logActivity(params: LogParams) {
  try {
    await db.activityLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || 'Admin',
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
      },
    })
  } catch (e) {
    console.error('logActivity error:', e)
  }
}
