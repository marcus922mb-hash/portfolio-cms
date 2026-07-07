import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const results: Record<string, number> = {}

  if ((await db.category.count()) === 0) {
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
  results.categories = await db.category.count()

  if ((await db.tag.count()) === 0) {
    await db.tag.createMany({
      data: [
        { name: 'React', slug: 'react', color: '#61dafb' },
        { name: 'Next.js', slug: 'nextjs', color: '#000000' },
        { name: 'TypeScript', slug: 'typescript', color: '#3178c6' },
        { name: 'Tailwind', slug: 'tailwind', color: '#06b6d4' },
        { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
        { name: 'Prisma', slug: 'prisma', color: '#2d3748' },
        { name: 'Vercel', slug: 'vercel', color: '#000000' },
        { name: 'Supabase', slug: 'supabase', color: '#3ecf8e' },
      ],
    })
  }
  results.tags = await db.tag.count()

  if ((await db.user.count()) === 0) {
    const hashed = await bcrypt.hash('admin123', 10)
    await db.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Administrator',
        password: hashed,
        role: 'admin',
        bio: 'Główny administrator systemu CMS.',
      },
    })
  }
  results.users = await db.user.count()

  const tags = await db.tag.findMany()
  const tagMap: Record<string, string> = {}
  for (const t of tags) tagMap[t.slug] = t.id

  if ((await db.post.count()) === 0) {
    const categories = await db.category.findMany()
    const catMap: Record<string, string> = {}
    for (const c of categories) catMap[c.slug] = c.id

    await db.post.createMany({
      data: [
        {
          title: 'Budowa aplikacji Next.js z TypeScript',
          slug: 'budowa-aplikacji-nextjs-typescript',
          excerpt: 'Kompletny przewodnik po tworzeniu nowoczesnych aplikacji webowych z Next.js 16 i TypeScript.',
          content: '## Wprowadzenie\n\nNext.js to potężny framework React, który pozwala na budowanie aplikacji webowych o wyjątkowej wydajności.\n\n## Dlaczego TypeScript?\n\nTypeScript dodaje statyczne typowanie do JavaScript, co znacząco poprawia jakość kodu.\n\n## Podsumowanie\n\nNext.js + TypeScript to doskonały stack dla nowoczesnych aplikacji.',
          featuredImage: '',
          status: 'published',
          authorName: 'Administrator',
          categoryId: catMap['web-development'],
          publishedAt: new Date(),
          metaTitle: 'Budowa aplikacji Next.js z TypeScript - Przewodnik',
          metaDescription: 'Kompletny przewodnik po tworzeniu nowoczesnych aplikacji webowych z Next.js 16 i TypeScript.',
        },
        {
          title: 'AI w codziennym development - praktyczne zastosowania',
          slug: 'ai-w-codziennym-dev-praktyczne-zastosowania',
          excerpt: 'Jak sztuczna inteligencja zmienia sposób, w jaki programiści pracują na co dzień.',
          content: '## AI w development\n\nSztuczna inteligencja rewolucjonizuje sposób, w jaki tworzymy oprogramowanie.\n\n## Narzędzia AI\n\n- GitHub Copilot\n- ChatGPT\n- Claude\n\n## Przyszłość\n\nAI będzie coraz bardziej zintegrowane z naszym workflow.',
          featuredImage: '',
          status: 'published',
          authorName: 'Administrator',
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
          authorName: 'Administrator',
          categoryId: catMap['tutorials'],
          publishedAt: new Date(Date.now() - 172800000),
        },
      ],
    })

    const allPosts = await db.post.findMany()
    for (const p of allPosts) {
      if (p.slug.includes('nextjs') || p.slug.includes('budowa')) {
        await db.postTag.createMany({
          data: ['nextjs', 'typescript', 'react'].map(s => ({ postId: p.id, tagId: tagMap[s] })).filter(x => x.tagId),
        })
      } else if (p.slug.includes('ai')) {
        await db.postTag.createMany({
          data: ['typescript'].map(s => ({ postId: p.id, tagId: tagMap[s] })).filter(x => x.tagId),
        })
      } else if (p.slug.includes('postgresql')) {
        await db.postTag.createMany({
          data: ['postgresql', 'prisma'].map(s => ({ postId: p.id, tagId: tagMap[s] })).filter(x => x.tagId),
        })
      }
    }
    results.posts = 3
  }
  results.posts = await db.post.count()

  if ((await db.project.count()) === 0) {
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
          clientName: 'Demo Client',
          projectUrl: 'https://example.com',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-15'),
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
  results.projects = await db.project.count()

  if ((await db.page.count()) === 0) {
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
  results.pages = await db.page.count()

  if ((await db.setting.count()) === 0) {
    await db.setting.createMany({
      data: [
        { key: 'site.title', value: 'Portfolio CMS' },
        { key: 'site.description', value: 'Moje projekty, wpisy i doświadczenia w jednym miejscu.' },
        { key: 'site.author', value: 'Marek Białkowski' },
        { key: 'site.themeColor', value: '#10b981' },
        { key: 'site.logo', value: '' },
        { key: 'site.favicon', value: '' },
        { key: 'site.language', value: 'pl-PL' },
        { key: 'site.timezone', value: 'Europe/Warsaw' },
        { key: 'site.footer', value: '© 2026 Portfolio CMS. Wszelkie prawa zastrzeżone.' },
        { key: 'social.github', value: 'https://github.com/marcus922mb-hash' },
        { key: 'social.linkedin', value: '' },
        { key: 'social.twitter', value: '' },
        { key: 'social.instagram', value: '' },
        { key: 'social.youtube', value: '' },
        { key: 'seo.metaTitle', value: 'Portfolio CMS - Projekty, blog i doświadczenia' },
        { key: 'seo.metaDescription', value: 'Portfolio CMS - moja osobista przestrzeń do dzielenia się projektami, wpisami i wiedzą.' },
        { key: 'seo.googleAnalytics', value: '' },
        { key: 'seo.googleSearchConsole', value: '' },
        { key: 'comments.moderation', value: 'manual' },
        { key: 'comments.allowReplies', value: 'true' },
        { key: 'appearance.heroTitle', value: 'Witaj na moim portfolio' },
        { key: 'appearance.heroSubtitle', value: 'Projekty, wpis i doświadczenia w jednym miejscu.' },
        { key: 'appearance.heroImage', value: '' },
        { key: 'appearance.layout', value: 'modern' },
        { key: 'appearance.showFeatured', value: 'true' },
        { key: 'appearance.postsPerPage', value: '6' },
      ],
    })
  }
  results.settings = await db.setting.count()

  if ((await db.contactSubmission.count()) === 0) {
    await db.contactSubmission.createMany({
      data: [
        {
          name: 'Anna Kowalska',
          email: 'anna@example.com',
          subject: 'Zapytanie o współpracę',
          message: 'Cześć! Chciałabym zapytać o możliwość stworzenia podobnej aplikacji dla mojej firmy.',
          status: 'new',
        },
        {
          name: 'Piotr Nowak',
          email: 'piotr@example.com',
          subject: 'Pytanie techniczne',
          message: 'Jakiego frameworka użyłeś do budowy TaskFlow?',
          status: 'read',
        },
      ],
    })
  }
  results.contactSubmissions = await db.contactSubmission.count()

  console.log('Seed completed:', JSON.stringify(results, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
