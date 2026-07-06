import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/seed-all - seed all demo data (idempotent)
export async function POST() {
  const existingPosts = await db.post.count()
  const existingCategories = await db.category.count()
  const existingProjects = await db.project.count()

  // Seed categories
  if (existingCategories === 0) {
    await db.category.createMany({
      data: [
        { name: 'Web Development', slug: 'web-development', color: '#10b981' },
        { name: 'Mobile Apps', slug: 'mobile-apps', color: '#f59e0b' },
        { name: 'AI & ML', slug: 'ai-ml', color: '#8b5cf6' },
        { name: 'Tutorials', slug: 'tutorials', color: '#06b6d4' },
        { name: 'News', slug: 'news', color: '#ef4444' },
      ],
    })
  }

  const categories = await db.category.findMany()
  const catMap: Record<string, string> = {}
  for (const c of categories) catMap[c.slug] = c.id

  // Seed posts
  if (existingPosts === 0) {
    await db.post.createMany({
      data: [
        {
          title: 'Budowa aplikacji Next.js z TypeScript',
          slug: 'budowa-aplikacji-nextjs-typescript',
          excerpt: 'Kompletny przewodnik po tworzeniu nowoczesnych aplikacji webowych z Next.js 16 i TypeScript.',
          content: '## Wprowadzenie\n\nNext.js to potężny framework React, który pozwala na budowanie aplikacji webowych o wyjątkowej wydajności.\n\n## Dlaczego TypeScript?\n\nTypeScript dodaje statyczne typowanie do JavaScript, co znacząco poprawia jakość kodu.\n\n## Podsumowanie\n\nNext.js + TypeScript to doskonały stack dla nowoczesnych aplikacji.',
          featuredImage: '',
          status: 'published',
          authorName: 'Admin',
          categoryId: catMap['web-development'],
          publishedAt: new Date(),
        },
        {
          title: 'AI w codziennym开发 - praktyczne zastosowania',
          slug: 'ai-w-codziennym-dev-praktyczne-zastosowania',
          excerpt: 'Jak sztuczna inteligencja zmienia sposób, w jaki programiści pracują na co dzień.',
          content: '## AI w development\n\nSztuczna inteligencja rewolucjonizuje sposób, w jaki tworzymy oprogramowanie.\n\n## Narzędzia AI\n\n- GitHub Copilot\n- ChatGPT\n- Claude\n\n## Przyszłość\n\nAI będzie coraz bardziej zintegrowane z naszym workflow.',
          featuredImage: '',
          status: 'published',
          authorName: 'Admin',
          categoryId: catMap['ai-ml'],
          publishedAt: new Date(Date.now() - 86400000),
        },
        {
          title: 'Wprowadzenie do PostgreSQL i Prisma',
          slug: 'wprowadzenie-postgresql-prisma',
          excerpt: 'Naucz się, jak skutecznie pracować z PostgreSQL używając Prisma ORM.',
          content: '## PostgreSQL\n\nPostgreSQL to jedna z najpotężniejszych baz danych SQL.\n\n## Prisma ORM\n\nPrisma to nowoczesny ORM dla Node.js i TypeScript.\n\n## Podsumowanie\n\nPołączenie PostgreSQL + Prisma daje świetne rezultaty.',
          featuredImage: '',
          status: 'published',
          authorName: 'Admin',
          categoryId: catMap['tutorials'],
          publishedAt: new Date(Date.now() - 172800000),
        },
      ],
    })
  }

  // Seed projects
  if (existingProjects === 0) {
    await db.project.createMany({
      data: [
        {
          title: 'TaskFlow',
          summary: 'Aplikacja do zarządzania zadaniami w stylu Kanban z drag-and-drop.',
          description: 'TaskFlow to aplikacja webowa zbudowana w Next.js, która pozwala organizować zadania w kolumny Kanban.',
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
          description: 'WeatherCast pobiera dane z OpenWeather API i wyświetla 7-dniową prognozę wraz z wykresami.',
          techStack: JSON.stringify(['React', 'Recharts', 'PWA']),
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
          description: 'DevNotes to aplikacja do prowadzenia notatek technicznych w Markdown z kolorowaniem składni.',
          techStack: JSON.stringify(['Next.js', 'SQLite', 'react-markdown']),
          demoUrl: '',
          repoUrl: 'https://github.com/user/devnotes',
          imageUrl: '',
          status: 'published',
          featured: false,
          order: 3,
        },
      ],
    })
  }

  // Seed pages
  const existingPages = await db.page.count()
  if (existingPages === 0) {
    await db.page.createMany({
      data: [
        {
          title: 'O mnie',
          slug: 'about',
          content: '## Cześć! 👋\n\nNazywam się Marek i jestem pasjonatem technologii webowych.\n\n## Co robię?\n\nTworzę nowoczesne aplikacje webowe w Next.js i React.',
          status: 'published',
          order: 1,
          showInMenu: true,
        },
        {
          title: 'Kontakt',
          slug: 'contact',
          content: '## Skontaktuj się ze mną\n\n- 📧 Email: hello@example.com\n- 💼 LinkedIn: /marek\n- 🐙 GitHub: /marek',
          status: 'published',
          order: 2,
          showInMenu: true,
        },
        {
          title: 'Polityka prywatności',
          slug: 'privacy',
          content: '## Polityka prywatności\n\nTa strona używa cookies w celach technicznych.',
          status: 'published',
          order: 3,
          showInMenu: false,
        },
      ],
    })
  }

  // Seed settings
  const existingSettings = await db.setting.count()
  if (existingSettings === 0) {
    await db.setting.createMany({
      data: [
        { key: 'site.title', value: 'Portfolio CMS' },
        { key: 'site.description', value: 'Moje projekty, wpisy i doświadczenia w jednym miejscu.' },
        { key: 'site.author', value: 'Marek Białkowski' },
        { key: 'site.themeColor', value: '#10b981' },
        { key: 'social.github', value: 'https://github.com/marcus922mb-hash' },
        { key: 'social.linkedin', value: '' },
        { key: 'social.twitter', value: '' },
      ],
    })
  }

  return NextResponse.json({
    success: true,
    counts: {
      posts: await db.post.count(),
      projects: await db.project.count(),
      categories: await db.category.count(),
      pages: await db.page.count(),
      settings: await db.setting.count(),
    },
  })
}
