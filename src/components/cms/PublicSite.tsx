'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Calendar, ExternalLink, Github, Star, ArrowUpRight,
  Search, Mail, Tag as TagIcon, Clock, ChevronRight, Code2, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

type Project = {
  id: string; title: string; summary: string; description: string
  techStack: string; demoUrl: string | null; repoUrl: string | null
  imageUrl: string | null; status: string; featured: boolean
  order: number; createdAt: string; updatedAt: string
}

type Post = {
  id: string; title: string; slug: string; excerpt: string; content: string
  featuredImage: string | null; status: string; authorName: string
  categoryId: string | null; viewCount: number; publishedAt: string | null
  createdAt: string; updatedAt: string
  category?: { id: string; name: string; color: string } | null
  tags?: { tag: { id: string; name: string; slug: string; color: string } }[]
  _count?: { comments: number }
}

type Page = {
  id: string; title: string; slug: string; content: string
  featuredImage: string | null; status: string; order: number
  showInMenu: boolean; createdAt: string; updatedAt: string
}

type Settings = Record<string, string>

function parseTechStack(raw: string): string[] {
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [] } catch { return [] }
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return '—' }
}

const ACCENT = [
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
]
function techBadgeClass(t: string) { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return ACCENT[h % ACCENT.length] }

export type PublicView = 'home' | 'blog' | { blogPost: string } | 'projects' | { project: string } | { page: string } | 'contact'

export function PublicSite({
  view, setView, posts, projects, pages, settings,
}: {
  view: PublicView
  setView: (v: PublicView) => void
  posts: Post[]
  projects: Project[]
  pages: Page[]
  settings: Settings
}) {
  const siteTitle = settings['site.title'] || 'Portfolio CMS'
  const siteDesc = settings['site.description'] || ''
  const heroTitle = settings['appearance.heroTitle'] || siteTitle
  const heroSubtitle = settings['appearance.heroSubtitle'] || siteDesc
  const footer = settings['site.footer'] || `© ${new Date().getFullYear()} ${siteTitle}`
  const menuPages = pages.filter(p => p.showInMenu && p.status === 'published').sort((a, b) => a.order - b.order)

  const publishedPosts = useMemo(() => posts.filter(p => p.status === 'published').sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()), [posts])
  const publishedProjects = useMemo(() => projects.filter(p => p.status === 'published').sort((a, b) => a.order - b.order), [projects])
  const featuredProjects = publishedProjects.filter(p => p.featured)

  // Single post view
  if (typeof view === 'object' && 'blogPost' in view) {
    const post = publishedPosts.find(p => p.slug === view.blogPost)
    if (!post) return <NotFoundView setView={setView} />
    return <BlogPostView post={post} setView={setView} relatedPosts={publishedPosts.filter(p => p.id !== post.id).slice(0, 3)} />
  }
  // Single project view
  if (typeof view === 'object' && 'project' in view) {
    const project = projects.find(p => p.id === view.project)
    if (!project) return <NotFoundView setView={setView} />
    return <ProjectView project={project} setView={setView} />
  }
  // Single page view
  if (typeof view === 'object' && 'page' in view) {
    const page = pages.find(p => p.slug === view.page)
    if (!page) return <NotFoundView setView={setView} />
    return <PageView page={page} setView={setView} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setView('home')} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: settings['site.themeColor'] || '#10b981' }}>
              <Code2 className="h-5 w-5" />
            </div>
            <div className="font-semibold">{siteTitle}</div>
          </button>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => setView('home')}>Start</Button>
            <Button variant="ghost" size="sm" onClick={() => setView('blog')}>Blog</Button>
            <Button variant="ghost" size="sm" onClick={() => setView('projects')}>Projekty</Button>
            {menuPages.map(p => (
              <Button key={p.id} variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => setView({ page: p.slug })}>{p.title}</Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setView('contact')}>Kontakt</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={JSON.stringify(view)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {view === 'home' && (
              <HomeView heroTitle={heroTitle} heroSubtitle={heroSubtitle} posts={publishedPosts.slice(0, 3)} projects={featuredProjects.slice(0, 3)} allProjectsCount={publishedProjects.length} setView={setView} settings={settings} />
            )}
            {view === 'blog' && <BlogView posts={publishedPosts} setView={setView} />}
            {view === 'projects' && <ProjectsView projects={publishedProjects} setView={setView} />}
            {view === 'contact' && <ContactView setView={setView} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-muted-foreground text-center">
          {footer}
          <div className="mt-2 flex items-center justify-center gap-3">
            {settings['social.github'] && <a href={settings['social.github']} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><Github className="h-4 w-4" /></a>}
            {settings['social.linkedin'] && <a href={settings['social.linkedin']} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><ExternalLink className="h-4 w-4" /></a>}
            {settings['social.twitter'] && <a href={settings['social.twitter']} target="_blank" rel="noopener noreferrer" className="hover:text-foreground"><ExternalLink className="h-4 w-4" /></a>}
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomeView({ heroTitle, heroSubtitle, posts, projects, allProjectsCount, setView, settings }: {
  heroTitle: string; heroSubtitle: string; posts: Post[]; projects: Project[]; allProjectsCount: number; setView: (v: PublicView) => void; settings: Settings
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at top right, ${settings['site.themeColor'] || '#10b981'}, transparent 60%)` }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-4 gap-1.5"><Sparkles className="h-3 w-3" /> Witaj</Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto">{heroTitle}</h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">{heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button size="lg" onClick={() => setView('projects')}>Zobacz projekty <ArrowUpRight className="h-4 w-4 ml-1" /></Button>
              <Button size="lg" variant="outline" onClick={() => setView('blog')}>Czytaj blog</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Wyróżnione projekty</h2>
              <p className="text-muted-foreground mt-1">Wybrane realizacje, z których jestem dumny.</p>
            </div>
            <Button variant="ghost" onClick={() => setView('projects')}>Wszystkie ({allProjectsCount}) <ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => <ProjectCardMini key={p.id} project={p} onClick={() => setView({ project: p.id })} />)}
          </div>
        </section>
      )}

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="border-t border-border/40 bg-muted/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Ostatnie wpisy</h2>
                <p className="text-muted-foreground mt-1">Najnowsze artykuły z bloga.</p>
              </div>
              <Button variant="ghost" onClick={() => setView('blog')}>Wszystkie wpisy <ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(p => <PostCardMini key={p.id} post={p} onClick={() => setView({ blogPost: p.slug })} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function BlogView({ posts, setView }: { posts: Post[]; setView: (v: PublicView) => void }) {
  const [search, setSearch] = useState('')
  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">Wpisy, artykuły, przemyślenia.</p>
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj wpisów..." className="pl-9" />
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Brak wpisów.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <PostCardMini key={p.id} post={p} onClick={() => setView({ blogPost: p.slug })} />)}
        </div>
      )}
    </div>
  )
}

function ProjectsView({ projects, setView }: { projects: Project[]; setView: (v: PublicView) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Projekty</h1>
      <p className="text-muted-foreground mb-8">Wszystkie moje realizacje.</p>
      {projects.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">Brak projektów.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => <ProjectCardMini key={p.id} project={p} onClick={() => setView({ project: p.id })} />)}
        </div>
      )}
    </div>
  )
}

function ContactView({ setView }: { setView: (v: PublicView) => void }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => setView('home')} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Wróć</button>
      <h1 className="text-4xl font-bold mb-2">Kontakt</h1>
      <p className="text-muted-foreground mb-8">Napisz do mnie, a odpowiem najszybciej jak to możliwe.</p>
      <Card className="p-6">
        <div className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="name">Imię *</Label><Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid gap-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="grid gap-2"><Label htmlFor="subject">Temat</Label><Input id="subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
          <div className="grid gap-2"><Label htmlFor="message">Wiadomość *</Label><Textarea id="message" rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
          <Button disabled={sending} onClick={async () => {
            if (!form.name || !form.email || !form.message) { toast.error('Imię, email i wiadomość są wymagane'); return }
            setSending(true)
            try {
              const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
              if (!r.ok) throw new Error()
              toast.success('Wiadomość wysłana!')
              setForm({ name: '', email: '', subject: '', message: '' })
            } catch { toast.error('Nie udało się wysłać') } finally { setSending(false) }
          }}>{sending ? 'Wysyłanie...' : 'Wyślij wiadomość'} <Mail className="h-4 w-4 ml-2" /></Button>
        </div>
      </Card>
    </div>
  )
}

function BlogPostView({ post, setView, relatedPosts }: { post: Post; setView: (v: PublicView) => void; relatedPosts: Post[] }) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => setView('blog')} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Wróć do bloga</button>
      {post.category && <Badge variant="secondary" style={{ backgroundColor: post.category.color + '20', color: post.category.color, border: 0 }} className="mb-3">{post.category.name}</Badge>}
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
        <span>Autor: {post.authorName}</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.publishedAt || post.createdAt)}</span>
      </div>
      {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-lg mb-8" />}
      <div className="prose prose-lg dark:prose-invert max-w-none"><ReactMarkdown>{post.content}</ReactMarkdown></div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
          {post.tags.map(t => <Badge key={t.tag.id} variant="outline" className="gap-1"><TagIcon className="h-3 w-3" /> {t.tag.name}</Badge>)}
        </div>
      )}
      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-4">Powiązane wpisy</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedPosts.map(p => <PostCardMini key={p.id} post={p} onClick={() => setView({ blogPost: p.slug })} />)}
          </div>
        </div>
      )}
    </article>
  )
}

function ProjectView({ project, setView }: { project: Project; setView: (v: PublicView) => void }) {
  const techs = parseTechStack(project.techStack)
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => setView('projects')} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Wróć do projektów</button>
      {project.featured && <Badge className="mb-3"><Star className="h-3 w-3 mr-1 fill-current" /> Wyróżniony</Badge>}
      <h1 className="text-4xl font-bold mb-3">{project.title}</h1>
      <p className="text-xl text-muted-foreground mb-6">{project.summary}</p>
      {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="w-full aspect-[16/9] object-cover rounded-lg mb-8" />}
      {techs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {techs.map(t => <span key={t} className={cn("text-xs px-2.5 py-1 rounded-md border font-medium", techBadgeClass(t))}>{t}</span>)}
        </div>
      )}
      {project.description && <div className="prose prose-lg dark:prose-invert max-w-none mb-8"><ReactMarkdown>{project.description}</ReactMarkdown></div>}
      <div className="flex flex-wrap gap-3">
        {project.demoUrl && <Button asChild><a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-1.5" /> Zobacz demo</a></Button>}
        {project.repoUrl && <Button asChild variant="outline"><a href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4 mr-1.5" /> Kod źródłowy</a></Button>}
      </div>
    </article>
  )
}

function PageView({ page, setView }: { page: Page; setView: (v: PublicView) => void }) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => setView('home')} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Wróć</button>
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      {page.featuredImage && <img src={page.featuredImage} alt={page.title} className="w-full aspect-[16/9] object-cover rounded-lg mb-8" />}
      <div className="prose prose-lg dark:prose-invert max-w-none"><ReactMarkdown>{page.content}</ReactMarkdown></div>
    </article>
  )
}

function NotFoundView({ setView }: { setView: (v: PublicView) => void }) {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-6xl font-bold text-muted-foreground mb-2">404</div>
      <p className="text-muted-foreground mb-6">Nie znaleziono treści.</p>
      <Button onClick={() => setView('home')}>Wróć na stronę główną</Button>
    </div>
  )
}

function PostCardMini({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <Card className="overflow-hidden p-0 hover:shadow-md transition-shadow cursor-pointer" >
      <button onClick={onClick} className="text-left w-full">
        {post.featuredImage ? (
          <div className="aspect-[16/9] bg-muted overflow-hidden">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <Code2 className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="p-4">
          {post.category && <Badge variant="secondary" style={{ backgroundColor: post.category.color + '20', color: post.category.color, border: 0 }} className="mb-2">{post.category.name}</Badge>}
          <h3 className="font-semibold mb-1 line-clamp-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.excerpt}</p>
          <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(post.publishedAt || post.createdAt)}</div>
        </div>
      </button>
    </Card>
  )
}

function ProjectCardMini({ project, onClick }: { project: Project; onClick: () => void }) {
  const techs = parseTechStack(project.techStack)
  return (
    <Card className="overflow-hidden p-0 hover:shadow-md transition-shadow cursor-pointer">
      <button onClick={onClick} className="text-left w-full">
        <div className="aspect-[16/9] bg-muted overflow-hidden relative">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"><Code2 className="h-10 w-10 text-muted-foreground/30" /></div>
          )}
          {project.featured && <Badge className="absolute top-3 left-3"><Star className="h-3 w-3 mr-1 fill-current" /> Wyróżniony</Badge>}
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.summary}</p>
          {techs.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {techs.slice(0, 3).map(t => <span key={t} className={cn("text-[10px] px-1.5 py-0.5 rounded border", techBadgeClass(t))}>{t}</span>)}
            </div>
          )}
        </div>
      </button>
    </Card>
  )
}
