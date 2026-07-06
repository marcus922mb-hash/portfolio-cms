import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

// GET /api/projects/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) {
    return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 })
  }
  return NextResponse.json(project)
}

// PUT /api/projects/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const { title, summary, description, techStack, demoUrl, repoUrl, imageUrl, status, featured, order } = body

    const project = await db.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(summary !== undefined && { summary }),
        ...(description !== undefined && { description }),
        ...(techStack !== undefined && { techStack: JSON.stringify(techStack) }),
        ...(demoUrl !== undefined && { demoUrl: demoUrl || null }),
        ...(repoUrl !== undefined && { repoUrl: repoUrl || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się zaktualizować' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await db.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error)
    return NextResponse.json({ error: 'Nie udało się usunąć' }, { status: 500 })
  }
}
