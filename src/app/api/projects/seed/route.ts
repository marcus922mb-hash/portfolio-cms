import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/projects/seed - seed demo projects (idempotent)
export async function POST() {
  const existing = await db.project.count()
  if (existing > 0) {
    return NextResponse.json({ message: 'Baza już zawiera projekty', count: existing })
  }

  await db.project.createMany({
    data: [
      {
        title: 'TaskFlow',
        summary: 'Aplikacja do zarządzania zadaniami w stylu Kanban z drag-and-drop.',
        description: 'TaskFlow to aplikacja webowa zbudowana w Next.js, która pozwala organizować zadania w kolumny Kanban. Obsługuje drag-and-drop, przypisanie osób, terminy oraz eksport do PDF.',
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'Tailwind']),
        demoUrl: 'https://example.com/taskflow',
        repoUrl: 'https://github.com/user/taskflow',
        imageUrl: '',
        status: 'published',
        featured: true,
        order: 1,
      },
      {
        title: 'WeatherCast',
        summary: 'Prognoza pogody z wykresami i powiadomieniami push.',
        description: 'WeatherCast pobiera dane z OpenWeather API i wyświetla 7-dniową prognozę wraz z interaktywnymi wykresami temperatury i opadów. Obsługuje subskrypcję powiadomień push dla ostrzeżeń pogodowych.',
        techStack: JSON.stringify(['React', 'Recharts', 'PWA', 'Service Worker']),
        demoUrl: 'https://example.com/weather',
        repoUrl: 'https://github.com/user/weathercast',
        imageUrl: '',
        status: 'published',
        featured: false,
        order: 2,
      },
      {
        title: 'DevNotes',
        summary: 'Markdown notatnik z zakładkami i pełnotekstowym wyszukiwaniem.',
        description: 'DevNotes to aplikacja do prowadzenia notatek technicznych w Markdown. Posiada kolorowanie składni, podział na foldery, pełnotekstowe wyszukiwanie (SQLite FTS5) oraz eksport do HTML/PDF.',
        techStack: JSON.stringify(['Next.js', 'SQLite', 'react-markdown', 'Fuse.js']),
        demoUrl: '',
        repoUrl: 'https://github.com/user/devnotes',
        imageUrl: '',
        status: 'published',
        featured: false,
        order: 3,
      },
    ],
  })

  return NextResponse.json({ message: 'Dodano przykładowe projekty', count: 3 })
}
