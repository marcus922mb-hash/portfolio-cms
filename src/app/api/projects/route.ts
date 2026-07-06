import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/projects - list all projects (optionally only published)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // "published" | "all"
  const orderBy = searchParams.get('orderBy') as 'createdAt' | 'order' | 'title' | undefined

  const where = status && status !== 'all' ? { status } : {}
  const projects = await db.project.findMany({
    where,
    orderBy: [
      ...(orderBy === 'order' ? [{ order: 'asc' as const }] : []),
      { createdAt: 'desc' as const },
    ],
  })

  return NextResponse.json(projects)
}

// POST /api/projects - create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, summary, description, techStack, demoUrl, repoUrl, imageUrl, status, featured, order } = body

    if (!title || !summary) {
      return NextResponse.json(
        { error: 'Tytuł i podsumowanie są wymagane' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        title,
        summary,
        description: description ?? '',
        techStack: JSON.stringify(techStack ?? []),
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        imageUrl: imageUrl || null,
        status: status ?? 'published',
        featured: featured ?? false,
        order: order ?? 0,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('POST /api/projects error:', error)
    return NextResponse.json(
      { error: 'Nie udało się utworzyć projektu' },
      { status: 500 }
    )
  }
}
