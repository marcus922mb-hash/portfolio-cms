import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [posts, projects, pages, categories, tags, comments, media, settings, contactSubmissions, activityLogs, users] = await Promise.all([
    db.post.findMany(),
    db.project.findMany(),
    db.page.findMany(),
    db.category.findMany(),
    db.tag.findMany(),
    db.comment.findMany(),
    db.media.findMany(),
    db.setting.findMany(),
    db.contactSubmission.findMany(),
    db.activityLog.findMany({ take: 500, orderBy: { createdAt: 'desc' } }),
    db.user.findMany({ select: { id: true, email: true, name: true, role: true, avatar: true, bio: true, createdAt: true } }),
  ])

  const settingsObj: Record<string, string> = {}
  for (const s of settings) settingsObj[s.key] = s.value

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    version: '2.0',
    counts: {
      posts: posts.length, projects: projects.length, pages: pages.length,
      categories: categories.length, tags: tags.length, comments: comments.length,
      media: media.length, settings: settings.length, contactSubmissions: contactSubmissions.length,
      activityLogs: activityLogs.length, users: users.length,
    },
    data: {
      posts, projects, pages, categories, tags, comments, media,
      settings: settingsObj, contactSubmissions, activityLogs, users,
    },
  })
}
