'use client'

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider, useTheme } from 'next-themes'
import {
  LayoutDashboard, Folder, FileText, File, Tag, MessageSquare,
  Image as ImageIcon, Settings, Plus, Search, ExternalLink, Github,
  Pencil, Trash2, X, Code2, Sparkles, Calendar, Eye, EyeOff, Sun, Moon,
  Star, Layers, TrendingUp, Users, FolderKanban, ChevronRight, Menu, Home,
  Save, MessageCircle, Tag as TagIcon, Palette, ArrowUpRight, Mail,
  Hash, FileEdit, Inbox, Filter, Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

// ==================== Types ====================
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
  comments?: Comment[]
  _count?: { comments: number }
}

type Page = {
  id: string; title: string; slug: string; content: string
  featuredImage: string | null; status: string; order: number
  showInMenu: boolean; createdAt: string; updatedAt: string
}

type Category = {
  id: string; name: string; slug: string; color: string; createdAt: string
  _count?: { posts: number }
}

type Comment = {
  id: string; postId: string; authorName: string; authorEmail: string
  content: string; status: string; createdAt: string
  post?: { id: string; title: string; slug: string }
}

type Media = {
  id: string; url: string; filename: string; altText: string | null
  mimeType: string; size: number; createdAt: string
}

type Settings = Record<string, string>

type Section = 'dashboard' | 'projects' | 'posts' | 'pages' | 'categories' | 'comments' | 'media' | 'settings'

// ==================== Helpers ====================
const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false)
}

function parseTechStack(raw: string): string[] {
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [] } catch { return [] }
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return '—' }
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return '—' }
}

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const ACCENT = [
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
  'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
]

function techBadgeClass(t: string): string {
  let h = 0
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0
  return ACCENT[h % ACCENT.length]
}

// ==================== Theme toggle ====================
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Zmień motyw">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

// ==================== Sidebar ====================
const NAV: { id: Section; label: string; icon: React.ElementType; group?: string }[] = [
  { id: 'dashboard', label: 'Pulpit', icon: LayoutDashboard },
  { id: 'projects', label: 'Projekty', icon: FolderKanban, group: 'Treść' },
  { id: 'posts', label: 'Wpisy', icon: FileText, group: 'Treść' },
  { id: 'pages', label: 'Strony', icon: File, group: 'Treść' },
  { id: 'categories', label: 'Kategorie', icon: Tag, group: 'Treść' },
  { id: 'comments', label: 'Komentarze', icon: MessageSquare, group: 'Interakcje' },
  { id: 'media', label: 'Biblioteka mediów', icon: ImageIcon, group: 'Interakcje' },
  { id: 'settings', label: 'Ustawienia', icon: Settings, group: 'System' },
]

function Sidebar({ section, setSection, counts, mobileOpen, setMobileOpen }: {
  section: Section
  setSection: (s: Section) => void
  counts: { posts: number; projects: number; pages: number; comments: number; categories: number; media: number }
  mobileOpen: boolean
  setMobileOpen: (b: boolean) => void
}) {
  const groups = useMemo(() => {
    const map: Record<string, typeof NAV> = { _main: [] }
    for (const item of NAV) {
      if (!item.group) map._main.push(item)
      else {
        if (!map[item.group]) map[item.group] = []
        map[item.group].push(item)
      }
    }
    return map
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm">Portfolio CMS</div>
            <div className="text-[10px] text-muted-foreground">Panel administracyjny</div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {groups._main.map(item => (
            <NavItem key={item.id} item={item} active={section === item.id} onClick={() => { setSection(item.id); setMobileOpen(false) }} count={item.id === 'dashboard' ? undefined : counts[item.id as keyof typeof counts]} />
          ))}
          {Object.entries(groups).filter(([k]) => k !== '_main').map(([group, items]) => (
            <div key={group} className="space-y-1">
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{group}</div>
              {items.map(item => (
                <NavItem key={item.id} item={item} active={section === item.id} onClick={() => { setSection(item.id); setMobileOpen(false) }} count={counts[item.id as keyof typeof counts]} />
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
            <a href="/" target="_blank">
              <Home className="h-4 w-4 mr-2" /> Zobacz stronę
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        </div>
      </aside>
    </>
  )
}

function NavItem({ item, active, onClick, count }: {
  item: { id: Section; label: string; icon: React.ElementType }
  active: boolean
  onClick: () => void
  count?: number
}) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">{item.label}</span>
      {count !== undefined && count > 0 && (
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
          active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted-foreground/15 text-muted-foreground"
        )}>{count}</span>
      )}
    </button>
  )
}

// ==================== Stat Card ====================
function StatCard({ label, value, icon, trend, color = 'emerald' }: {
  label: string; value: number | string; icon: React.ReactNode; trend?: string; color?: string
}) {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>{icon}</div>
        {trend && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
          <TrendingUp className="h-3 w-3" /> {trend}
        </span>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </Card>
  )
}

// ==================== Page Header ====================
function PageHeader({ title, description, action }: {
  title: string; description?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ==================== Empty State ====================
function EmptyState({ icon: Icon, title, description, action }: {
  icon: React.ElementType; title: string; description: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}

// ==================== Dashboard ====================
function Dashboard({ data, onSeed }: {
  data: { posts: Post[]; projects: Project[]; pages: Page[]; categories: Category[]; comments: Comment[]; media: Media[]; settings: Settings }
  onSeed: () => Promise<void>
}) {
  const recentPosts = data.posts.slice(0, 5)
  const pendingComments = data.comments.filter(c => c.status === 'pending').slice(0, 5)
  const featuredProjects = data.projects.filter(p => p.featured)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pulpit"
        description="Przegląd Twojego CMS"
        action={<Button onClick={onSeed} variant="outline"><Sparkles className="h-4 w-4 mr-2" /> Zapełnij danymi demo</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projekty" value={data.projects.length} icon={<FolderKanban className="h-5 w-5" />} color="emerald" trend={`${featuredProjects.length} wyróżnionych`} />
        <StatCard label="Wpisy bloga" value={data.posts.length} icon={<FileText className="h-5 w-5" />} color="violet" trend={`${data.posts.filter(p => p.status === 'published').length} opublikowanych`} />
        <StatCard label="Strony" value={data.pages.length} icon={<File className="h-5 w-5" />} color="cyan" />
        <StatCard label="Komentarze" value={data.comments.length} icon={<MessageSquare className="h-5 w-5" />} color="amber" trend={`${pendingComments.length} oczekujących`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> Ostatnie wpisy</h3>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Brak wpisów</p>
          ) : (
            <div className="space-y-2">
              {recentPosts.map(post => (
                <div key={post.id} className="flex items-center gap-3 py-2 border-b last:border-0 border-border/60">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{post.title}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(post.publishedAt || post.createdAt)}</div>
                  </div>
                  {post.category && <Badge variant="secondary" style={{ backgroundColor: post.category.color + '20', color: post.category.color, border: 0 }}>{post.category.name}</Badge>}
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", post.status === 'published' ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{post.status === 'published' ? 'Opublikowany' : 'Szkic'}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending comments */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Oczekujące komentarze</h3>
          </div>
          {pendingComments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Brak oczekujących komentarzy</p>
          ) : (
            <div className="space-y-2">
              {pendingComments.map(c => (
                <div key={c.id} className="py-2 border-b last:border-0 border-border/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{c.authorName}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4"><Star className="h-4 w-4 text-amber-500" /> Wyróżnione projekty</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.map(p => (
              <div key={p.id} className="border rounded-lg p-3">
                <div className="font-medium text-sm mb-1">{p.title}</div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {parseTechStack(p.techStack).slice(0, 3).map(t => (
                    <span key={t} className={cn("text-[10px] px-1.5 py-0.5 rounded border", techBadgeClass(t))}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// ==================== Projects Section ====================
function ProjectsSection({ projects, onChange }: {
  projects: Project[]
  onChange: () => void
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [editing, setEditing] = useState<Project | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [viewing, setViewing] = useState<Project | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const filtered = useMemo(() => {
    let list = [...projects]
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q))
    }
    return list.sort((a, b) => a.order - b.order)
  }, [projects, search, statusFilter])

  const openNew = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (p: Project) => { setEditing(p); setFormOpen(true) }
  const openView = (p: Project) => { setViewing(p); setViewOpen(true) }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projekty"
        description={`${projects.length} ${projects.length === 1 ? 'projekt' : 'projektów'} w portfolio`}
        action={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Dodaj projekt</Button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj projektów..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-[160px]"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="published">Opublikowane</SelectItem>
            <SelectItem value="draft">Szkice</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="Brak projektów" description="Dodaj swój pierwszy projekt do portfolio." action={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Dodaj pierwszy projekt</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} onView={() => openView(p)} onEdit={() => openEdit(p)} onDelete={() => setDeleteTarget(p)} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} onSave={async (data) => {
        if (editing) {
          const r = await fetch(`/api/projects/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          if (!r.ok) throw new Error('update')
          toast.success('Projekt zaktualizowany')
        } else {
          const r = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          if (!r.ok) throw new Error('create')
          toast.success('Projekt dodany')
        }
        onChange()
      }} />

      <ProjectDetailDialog project={viewing} open={viewOpen} onOpenChange={setViewOpen} />

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć projekt?</AlertDialogTitle>
            <AlertDialogDescription>Czy na pewno chcesz usunąć <strong>{deleteTarget?.title}</strong>? Tej operacji nie można cofnąć.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (!deleteTarget) return
              await fetch(`/api/projects/${deleteTarget.id}`, { method: 'DELETE' })
              toast.success('Projekt usunięty')
              setDeleteTarget(null); onChange()
            }}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ProjectCard({ project, onView, onEdit, onDelete }: {
  project: Project; onView: () => void; onEdit: () => void; onDelete: () => void
}) {
  const techs = parseTechStack(project.techStack)
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Card className="group overflow-hidden h-full flex flex-col p-0 hover:shadow-md transition-shadow">
        <button onClick={onView} className="relative w-full aspect-[16/9] overflow-hidden bg-muted text-left">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"><Layers className="h-10 w-10 text-muted-foreground/30" /></div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && <Badge className="bg-amber-500/90 text-white border-0"><Star className="h-3 w-3 mr-1 fill-current" /> Wyróżniony</Badge>}
            {project.status === 'draft' && <Badge className="bg-zinc-900/80 text-white border-0"><EyeOff className="h-3 w-3 mr-1" /> Szkic</Badge>}
          </div>
        </button>
        <div className="flex flex-col flex-1 p-4 gap-2">
          <div className="flex items-start justify-between gap-2">
            <button onClick={onView} className="text-left flex-1">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
            </button>
            <div className="flex gap-1 shrink-0">
              {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground p-1"><ExternalLink className="h-4 w-4" /></a>}
              {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground p-1"><Github className="h-4 w-4" /></a>}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
          {techs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {techs.slice(0, 3).map(t => <span key={t} className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium", techBadgeClass(t))}>{t}</span>)}
              {techs.length > 3 && <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">+{techs.length - 3}</span>}
            </div>
          )}
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/60">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(project.createdAt)}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function ProjectFormDialog({ open, onOpenChange, initial, onSave }: {
  open: boolean; onOpenChange: (b: boolean) => void; initial: Project | null; onSave: (d: any) => Promise<void>
}) {
  const [form, setForm] = useState<any>({})
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({ title: initial.title, summary: initial.summary, description: initial.description, techStack: parseTechStack(initial.techStack), demoUrl: initial.demoUrl ?? '', repoUrl: initial.repoUrl ?? '', imageUrl: initial.imageUrl ?? '', status: initial.status, featured: initial.featured, order: initial.order })
    } else {
      setForm({ title: '', summary: '', description: '', techStack: [], demoUrl: '', repoUrl: '', imageUrl: '', status: 'published', featured: false, order: 0 })
    }
    setTechInput('')
  }, [initial, open])

  const addTech = () => { const t = techInput.trim().replace(/,$/, ''); if (t && !form.techStack.includes(t)) { setForm({ ...form, techStack: [...form.techStack, t] }); setTechInput('') } }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edytuj projekt' : 'Dodaj nowy projekt'}</DialogTitle>
          <DialogDescription>{initial ? 'Zmień dane projektu' : 'Wypełnij formularz, aby dodać projekt'}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2"><Label>Tytuł *</Label><Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid gap-2"><Label>Podsumowanie *</Label><Input value={form.summary || ''} onChange={e => setForm({ ...form, summary: e.target.value })} /></div>
          <div className="grid gap-2"><Label>Opis (Markdown)</Label><Textarea rows={5} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="font-mono text-sm" /></div>
          <div className="grid gap-2">
            <Label>Stack technologiczny</Label>
            <div className="flex gap-2">
              <Input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech() } }} placeholder="Wpisz i Enter" />
              <Button type="button" variant="secondary" onClick={addTech}><Plus className="h-4 w-4" /></Button>
            </div>
            {form.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {form.techStack.map((t: string) => <Badge key={t} variant="secondary" className="gap-1">{t}<button onClick={() => setForm({ ...form, techStack: form.techStack.filter((x: string) => x !== t) })}><X className="h-3 w-3" /></button></Badge>)}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>URL demo</Label><Input value={form.demoUrl || ''} onChange={e => setForm({ ...form, demoUrl: e.target.value })} /></div>
            <div className="grid gap-2"><Label>URL repo</Label><Input value={form.repoUrl || ''} onChange={e => setForm({ ...form, repoUrl: e.target.value })} /></div>
          </div>
          <div className="grid gap-2"><Label>URL obrazka</Label><Input value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></div>
          <div className="flex justify-between items-end pt-2 border-t">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status || 'published'} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published"><span className="flex items-center gap-2"><Eye className="h-4 w-4" /> Opublikowany</span></SelectItem>
                  <SelectItem value="draft"><span className="flex items-center gap-2"><EyeOff className="h-4 w-4" /> Szkic</span></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch id="featured" checked={form.featured || false} onCheckedChange={c => setForm({ ...form, featured: c })} />
              <Label htmlFor="featured" className="flex items-center gap-1.5 cursor-pointer"><Star className="h-4 w-4 text-amber-500" /> Wyróżnij</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button disabled={saving} onClick={async () => {
            if (!form.title?.trim() || !form.summary?.trim()) { toast.error('Tytuł i podsumowanie są wymagane'); return }
            setSaving(true)
            try { await onSave(form); onOpenChange(false) } catch { toast.error('Błąd zapisu') } finally { setSaving(false) }
          }}>{saving ? 'Zapisywanie...' : initial ? 'Zapisz zmiany' : 'Dodaj projekt'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ProjectDetailDialog({ project, open, onOpenChange }: {
  project: Project | null; open: boolean; onOpenChange: (b: boolean) => void
}) {
  if (!project) return null
  const techs = parseTechStack(project.techStack)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-2xl">{project.title}</DialogTitle><DialogDescription className="text-base">{project.summary}</DialogDescription></DialogHeader>
        {project.imageUrl && <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted"><img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = 'none'} /></div>}
        {techs.length > 0 && <div className="flex flex-wrap gap-2">{techs.map(t => <span key={t} className={cn("text-xs px-2.5 py-1 rounded-md border font-medium", techBadgeClass(t))}>{t}</span>)}</div>}
        {project.description && <div className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{project.description}</ReactMarkdown></div>}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {project.demoUrl && <Button asChild size="sm"><a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-1.5" /> Demo</a></Button>}
          {project.repoUrl && <Button asChild size="sm" variant="outline"><a href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4 mr-1.5" /> Kod</a></Button>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ==================== Posts Section ====================
function PostsSection({ posts, categories, onChange }: {
  posts: Post[]; categories: Category[]; onChange: () => void
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editing, setEditing] = useState<Post | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [viewing, setViewing] = useState<Post | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)

  const filtered = useMemo(() => {
    let list = [...posts]
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [posts, search, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader title="Wpisy" description={`${posts.length} wpisów na blogu`} action={<Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Dodaj wpis</Button>} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj wpisów..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="published">Opublikowane</SelectItem>
            <SelectItem value="draft">Szkice</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Brak wpisów" description="Dodaj swój pierwszy wpis na bloga." action={<Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Dodaj pierwszy wpis</Button>} />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tytuł</TableHead>
                <TableHead className="hidden md:table-cell">Kategoria</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Data</TableHead>
                <TableHead className="hidden md:table-cell text-right">Komentarze</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(post => (
                <TableRow key={post.id} className="cursor-pointer" onClick={() => { setViewing(post); setViewOpen(true) }}>
                  <TableCell className="font-medium">
                    <div className="line-clamp-1">{post.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 font-normal">{post.excerpt}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {post.category && <Badge variant="secondary" style={{ backgroundColor: post.category.color + '20', color: post.category.color, border: 0 }}>{post.category.name}</Badge>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", post.status === 'published' ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{post.status === 'published' ? 'Opublikowany' : 'Szkic'}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(post.publishedAt || post.createdAt)}</TableCell>
                  <TableCell className="hidden md:table-cell text-right text-sm">{post._count?.comments || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(post); setFormOpen(true) }}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(post)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <PostFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} categories={categories} onSave={async (data) => {
        if (editing) {
          const r = await fetch(`/api/posts/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          if (!r.ok) throw new Error('update')
          toast.success('Wpis zaktualizowany')
        } else {
          const r = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          if (!r.ok) throw new Error('create')
          toast.success('Wpis dodany')
        }
        onChange()
      }} />

      <PostDetailDialog post={viewing} open={viewOpen} onOpenChange={setViewOpen} />

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć wpis?</AlertDialogTitle>
            <AlertDialogDescription>Czy na pewno chcesz usunąć <strong>{deleteTarget?.title}</strong>?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (!deleteTarget) return
              await fetch(`/api/posts/${deleteTarget.id}`, { method: 'DELETE' })
              toast.success('Wpis usunięty')
              setDeleteTarget(null); onChange()
            }}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PostFormDialog({ open, onOpenChange, initial, categories, onSave }: {
  open: boolean; onOpenChange: (b: boolean) => void; initial: Post | null; categories: Category[]; onSave: (d: any) => Promise<void>
}) {
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({ title: initial.title, slug: initial.slug, excerpt: initial.excerpt, content: initial.content, featuredImage: initial.featuredImage || '', status: initial.status, authorName: initial.authorName, categoryId: initial.categoryId || '' })
    } else {
      setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', status: 'published', authorName: 'Admin', categoryId: '' })
    }
  }, [initial, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edytuj wpis' : 'Dodaj nowy wpis'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Tytuł *</Label>
            <Input value={form.title || ''} onChange={e => {
              const v = e.target.value
              setForm({ ...form, title: v, slug: form.slug || slugify(v) })
            }} />
          </div>
          <div className="grid gap-2"><Label>Slug (URL)</Label><Input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generowany z tytułu" /></div>
          <div className="grid gap-2"><Label>Zajawka *</Label><Textarea rows={2} value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Krótki opis wpisu" /></div>
          <div className="grid gap-2"><Label>Treść (Markdown)</Label><Textarea rows={10} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} className="font-mono text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Kategoria</Label>
              <Select value={form.categoryId || 'none'} onValueChange={v => setForm({ ...form, categoryId: v === 'none' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="Brak kategorii" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Brak —</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status || 'published'} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Opublikowany</SelectItem>
                  <SelectItem value="draft">Szkic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Autor</Label><Input value={form.authorName || ''} onChange={e => setForm({ ...form, authorName: e.target.value })} /></div>
            <div className="grid gap-2"><Label>URL obrazka</Label><Input value={form.featuredImage || ''} onChange={e => setForm({ ...form, featuredImage: e.target.value })} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button disabled={saving} onClick={async () => {
            if (!form.title?.trim() || !form.excerpt?.trim()) { toast.error('Tytuł i zajawka są wymagane'); return }
            setSaving(true)
            try { await onSave(form); onOpenChange(false) } catch { toast.error('Błąd zapisu') } finally { setSaving(false) }
          }}>{saving ? 'Zapisywanie...' : initial ? 'Zapisz zmiany' : 'Dodaj wpis'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PostDetailDialog({ post, open, onOpenChange }: {
  post: Post | null; open: boolean; onOpenChange: (b: boolean) => void
}) {
  if (!post) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
          <DialogDescription className="text-base">{post.excerpt}</DialogDescription>
        </DialogHeader>
        {post.featuredImage && <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted"><img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = 'none'} /></div>}
        <div className="flex items-center gap-3 text-sm">
          {post.category && <Badge variant="secondary" style={{ backgroundColor: post.category.color + '20', color: post.category.color, border: 0 }}>{post.category.name}</Badge>}
          <span className="text-muted-foreground">Autor: {post.authorName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>
        {post.content && <div className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{post.content}</ReactMarkdown></div>}
      </DialogContent>
    </Dialog>
  )
}

// ==================== Pages Section ====================
function PagesSection({ pages, onChange }: { pages: Page[]; onChange: () => void }) {
  const [editing, setEditing] = useState<Page | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader title="Strony" description={`${pages.length} stron statycznych`} action={<Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Dodaj stronę</Button>} />

      {pages.length === 0 ? (
        <EmptyState icon={File} title="Brak stron" description="Dodaj swoją pierwszą stronę statyczną." action={<Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Dodaj pierwszą stronę</Button>} />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tytuł</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">W menu</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map(page => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell className="hidden lg:table-cell"><span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", page.status === 'published' ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300")}>{page.status === 'published' ? 'Opublikowana' : 'Szkic'}</span></TableCell>
                  <TableCell className="hidden md:table-cell">{page.showInMenu ? <Badge variant="secondary">Tak</Badge> : <span className="text-xs text-muted-foreground">Nie</span>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(page); setFormOpen(true) }}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(page)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <PageFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} onSave={async (data) => {
        if (editing) {
          await fetch(`/api/pages/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          toast.success('Strona zaktualizowana')
        } else {
          await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          toast.success('Strona dodana')
        }
        onChange()
      }} />

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć stronę?</AlertDialogTitle>
            <AlertDialogDescription>Czy na pewno chcesz usunąć <strong>{deleteTarget?.title}</strong>?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (!deleteTarget) return
              await fetch(`/api/pages/${deleteTarget.id}`, { method: 'DELETE' })
              toast.success('Strona usunięta')
              setDeleteTarget(null); onChange()
            }}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function PageFormDialog({ open, onOpenChange, initial, onSave }: {
  open: boolean; onOpenChange: (b: boolean) => void; initial: Page | null; onSave: (d: any) => Promise<void>
}) {
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({ title: initial.title, slug: initial.slug, content: initial.content, featuredImage: initial.featuredImage || '', status: initial.status, order: initial.order, showInMenu: initial.showInMenu })
    } else {
      setForm({ title: '', slug: '', content: '', featuredImage: '', status: 'published', order: 0, showInMenu: true })
    }
  }, [initial, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{initial ? 'Edytuj stronę' : 'Dodaj nową stronę'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2"><Label>Tytuł *</Label><Input value={form.title || ''} onChange={e => { const v = e.target.value; setForm({ ...form, title: v, slug: form.slug || slugify(v) }) }} /></div>
          <div className="grid gap-2"><Label>Slug (URL)</Label><Input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
          <div className="grid gap-2"><Label>Treść (Markdown) *</Label><Textarea rows={12} value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} className="font-mono text-sm" /></div>
          <div className="grid gap-2"><Label>URL obrazka</Label><Input value={form.featuredImage || ''} onChange={e => setForm({ ...form, featuredImage: e.target.value })} /></div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status || 'published'} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Opublikowana</SelectItem>
                    <SelectItem value="draft">Szkic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Kolejność</Label>
                <Input type="number" value={form.order || 0} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-[80px]" />
              </div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch id="menu" checked={form.showInMenu ?? true} onCheckedChange={c => setForm({ ...form, showInMenu: c })} />
              <Label htmlFor="menu" className="cursor-pointer">Pokaż w menu</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button disabled={saving} onClick={async () => {
            if (!form.title?.trim() || !form.content?.trim()) { toast.error('Tytuł i treść są wymagane'); return }
            setSaving(true)
            try { await onSave(form); onOpenChange(false) } catch { toast.error('Błąd zapisu') } finally { setSaving(false) }
          }}>{saving ? 'Zapisywanie...' : initial ? 'Zapisz zmiany' : 'Dodaj stronę'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ==================== Categories Section ====================
function CategoriesSection({ categories, onChange }: { categories: Category[]; onChange: () => void }) {
  const [editing, setEditing] = useState<Category | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [form, setForm] = useState<any>({})

  const open = (c: Category | null) => {
    setEditing(c)
    setForm(c ? { name: c.name, color: c.color } : { name: '', color: '#6b7280' })
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Kategorie" description={`${categories.length} kategorii`} action={<Button onClick={() => open(null)}><Plus className="h-4 w-4 mr-2" /> Dodaj kategorię</Button>} />

      {categories.length === 0 ? (
        <EmptyState icon={Tag} title="Brak kategorii" description="Dodaj pierwszą kategorię dla wpisów." action={<Button onClick={() => open(null)}><Plus className="h-4 w-4 mr-2" /> Dodaj kategorię</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(c => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                  <h3 className="font-semibold">{c.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => open(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(c)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-3 w-3" /> /{c.slug}
                <span className="ml-auto">{c._count?.posts || 0} wpisów</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader><DialogTitle>{editing ? 'Edytuj kategorię' : 'Nowa kategoria'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label>Nazwa *</Label><Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2">
              <Label>Kolor</Label>
              <div className="flex gap-2 items-center">
                <Input type="color" value={form.color || '#6b7280'} onChange={e => setForm({ ...form, color: e.target.value })} className="w-16 h-10 p-1" />
                <Input value={form.color || ''} onChange={e => setForm({ ...form, color: e.target.value })} className="font-mono" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Anuluj</Button>
            <Button onClick={async () => {
              if (!form.name?.trim()) { toast.error('Nazwa jest wymagana'); return }
              if (editing) {
                await fetch(`/api/categories/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
                toast.success('Kategoria zaktualizowana')
              } else {
                await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
                toast.success('Kategoria dodana')
              }
              setFormOpen(false); onChange()
            }}>{editing ? 'Zapisz' : 'Dodaj'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć kategorię?</AlertDialogTitle>
            <AlertDialogDescription>Wpisy w tej kategorii pozostaną, ale stracą przypisanie.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (!deleteTarget) return
              await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE' })
              toast.success('Kategoria usunięta')
              setDeleteTarget(null); onChange()
            }}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ==================== Comments Section ====================
function CommentsSection({ comments, onChange }: { comments: Comment[]; onChange: () => void }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const filtered = useMemo(() => statusFilter === 'all' ? comments : comments.filter(c => c.status === statusFilter), [comments, statusFilter])

  const setStatus = async (c: Comment, status: 'pending' | 'approved' | 'spam') => {
    await fetch(`/api/comments/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    toast.success(`Komentarz oznaczony jako ${status}`)
    onChange()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Komentarze" description={`${comments.length} komentarzy`} />

      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'spam'].map(s => (
          <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)}>
            {s === 'all' ? 'Wszystkie' : s === 'pending' ? 'Oczekujące' : s === 'approved' ? 'Zatwierdzone' : 'Spam'}
            <Badge variant="secondary" className="ml-2">
              {s === 'all' ? comments.length : comments.filter(c => c.status === s).length}
            </Badge>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Brak komentarzy" description="Nie ma jeszcze komentarzy w tej kategorii." />
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">{c.authorName.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{c.authorName}</span>
                    {c.authorEmail && <span className="text-xs text-muted-foreground">&lt;{c.authorEmail}&gt;</span>}
                    <span className="text-xs text-muted-foreground">· {formatDateTime(c.createdAt)}</span>
                    {c.status !== 'approved' && <Badge variant="secondary" className={cn('ml-auto', c.status === 'pending' && 'bg-amber-500/10 text-amber-700 dark:text-amber-300', c.status === 'spam' && 'bg-rose-500/10 text-rose-700 dark:text-rose-300')}>{c.status}</Badge>}
                  </div>
                  <p className="text-sm mb-2">{c.content}</p>
                  {c.post && <p className="text-xs text-muted-foreground">↳ <span className="font-medium">{c.post.title}</span></p>}
                  <div className="flex gap-2 mt-3">
                    {c.status !== 'approved' && <Button size="sm" variant="outline" onClick={() => setStatus(c, 'approved')}><Eye className="h-3 w-3 mr-1" /> Zatwierdź</Button>}
                    {c.status !== 'pending' && <Button size="sm" variant="outline" onClick={() => setStatus(c, 'pending')}>Oznacz jako oczekujący</Button>}
                    {c.status !== 'spam' && <Button size="sm" variant="outline" onClick={() => setStatus(c, 'spam')}><X className="h-3 w-3 mr-1" /> Spam</Button>}
                    <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={async () => {
                      await fetch(`/api/comments/${c.id}`, { method: 'DELETE' })
                      toast.success('Komentarz usunięty')
                      onChange()
                    }}><Trash2 className="h-3 w-3 mr-1" /> Usuń</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== Media Section ====================
function MediaSection({ media, onChange }: { media: Media[]; onChange: () => void }) {
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<any>({})
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader title="Biblioteka mediów" description={`${media.length} plików`} action={<Button onClick={() => { setForm({ url: '', filename: '', altText: '', mimeType: 'image/*', size: 0 }); setFormOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Dodaj media</Button>} />

      {media.length === 0 ? (
        <EmptyState icon={ImageIcon} title="Brak mediów" description="Dodaj pierwszy plik do biblioteki mediów." action={<Button onClick={() => { setForm({ url: '', filename: '', altText: '', mimeType: 'image/*', size: 0 }); setFormOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Dodaj media</Button>} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(m => (
            <Card key={m.id} className="group overflow-hidden p-0">
              <div className="aspect-square bg-muted relative">
                {m.mimeType.startsWith('image/') ? (
                  <img src={m.url} alt={m.altText || m.filename} className="w-full h-full object-cover" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><File className="h-10 w-10 text-muted-foreground/40" /></div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={async () => {
                    await navigator.clipboard.writeText(m.url)
                    toast.success('URL skopiowany')
                  }}><Download className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(m)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium truncate">{m.filename}</div>
                <div className="text-[10px] text-muted-foreground">{(m.size / 1024).toFixed(1)} KB</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Dodaj media</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label>URL pliku *</Label><Input value={form.url || ''} onChange={e => setForm({ ...form, url: e.target.value, filename: form.filename || e.target.value.split('/').pop() || '' })} placeholder="https://..." /></div>
            <div className="grid gap-2"><Label>Nazwa pliku *</Label><Input value={form.filename || ''} onChange={e => setForm({ ...form, filename: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Tekst alternatywny</Label><Input value={form.altText || ''} onChange={e => setForm({ ...form, altText: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Typ MIME</Label><Input value={form.mimeType || 'image/*'} onChange={e => setForm({ ...form, mimeType: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Rozmiar (bytes)</Label><Input type="number" value={form.size || 0} onChange={e => setForm({ ...form, size: parseInt(e.target.value) || 0 })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Anuluj</Button>
            <Button onClick={async () => {
              if (!form.url?.trim() || !form.filename?.trim()) { toast.error('URL i nazwa są wymagane'); return }
              await fetch('/api/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
              toast.success('Media dodane')
              setFormOpen(false); onChange()
            }}>Dodaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć plik?</AlertDialogTitle>
            <AlertDialogDescription>Plik zostanie usunięty z biblioteki mediów.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (!deleteTarget) return
              await fetch(`/api/media/${deleteTarget.id}`, { method: 'DELETE' })
              toast.success('Plik usunięty')
              setDeleteTarget(null); onChange()
            }}>Usuń</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ==================== Settings Section ====================
function SettingsSection({ settings, onChange }: { settings: Settings; onChange: () => void }) {
  const [form, setForm] = useState<Settings>(settings)
  const [saving, setSaving] = useState(false)

  useEffect(() => setForm(settings), [settings])

  const fields: { group: string; items: { key: string; label: string; type?: 'text' | 'color' | 'textarea' }[] }[] = [
    {
      group: 'Ogólne',
      items: [
        { key: 'site.title', label: 'Tytuł strony' },
        { key: 'site.description', label: 'Opis strony', type: 'textarea' },
        { key: 'site.author', label: 'Autor' },
        { key: 'site.themeColor', label: 'Kolor motywu', type: 'color' },
      ],
    },
    {
      group: 'Media społecznościowe',
      items: [
        { key: 'social.github', label: 'GitHub URL' },
        { key: 'social.linkedin', label: 'LinkedIn URL' },
        { key: 'social.twitter', label: 'Twitter URL' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Ustawienia" description="Konfiguracja Twojego CMS" action={
        <Button disabled={saving} onClick={async () => {
          setSaving(true)
          try {
            await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            toast.success('Ustawienia zapisane')
            onChange()
          } catch { toast.error('Błąd zapisu') } finally { setSaving(false) }
        }}><Save className="h-4 w-4 mr-2" /> {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}</Button>
      } />

      <div className="grid gap-6">
        {fields.map(group => (
          <Card key={group.group} className="p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Palette className="h-4 w-4" /> {group.group}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.items.map(item => (
                <div key={item.key} className="grid gap-2">
                  <Label htmlFor={item.key}>{item.label}</Label>
                  {item.type === 'textarea' ? (
                    <Textarea id={item.key} rows={2} value={form[item.key] || ''} onChange={e => setForm({ ...form, [item.key]: e.target.value })} />
                  ) : item.type === 'color' ? (
                    <div className="flex gap-2 items-center">
                      <Input type="color" id={item.key} value={form[item.key] || '#6b7280'} onChange={e => setForm({ ...form, [item.key]: e.target.value })} className="w-16 h-10 p-1" />
                      <Input value={form[item.key] || ''} onChange={e => setForm({ ...form, [item.key]: e.target.value })} className="font-mono" />
                    </div>
                  ) : (
                    <Input id={item.key} value={form[item.key] || ''} onChange={e => setForm({ ...form, [item.key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==================== Main App ====================
function CMSApp() {
  const [section, setSection] = useState<Section>('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [data, setData] = useState<{ posts: Post[]; projects: Project[]; pages: Page[]; categories: Category[]; comments: Comment[]; media: Media[]; settings: Settings }>({
    posts: [], projects: [], pages: [], categories: [], comments: [], media: [], settings: {},
  })
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const [postsRes, projectsRes, pagesRes, categoriesRes, commentsRes, mediaRes, settingsRes] = await Promise.all([
        fetch('/api/posts?status=all').then(r => r.json()).catch(() => []),
        fetch('/api/projects?status=all').then(r => r.json()).catch(() => []),
        fetch('/api/pages').then(r => r.json()).catch(() => []),
        fetch('/api/categories').then(r => r.json()).catch(() => []),
        fetch('/api/comments?status=all').then(r => r.json()).catch(() => []),
        fetch('/api/media').then(r => r.json()).catch(() => []),
        fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      ])
      setData({
        posts: postsRes, projects: projectsRes, pages: pagesRes,
        categories: categoriesRes, comments: commentsRes, media: mediaRes, settings: settingsRes,
      })
    } catch (e) {
      console.error(e)
      toast.error('Nie udało się pobrać danych')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Auto-seed on first mount if empty
  useEffect(() => {
    if (!loading && data.projects.length === 0 && data.posts.length === 0) {
      fetch('/api/seed-all', { method: 'POST' }).then(() => fetchAll()).catch(() => {})
    }
  }, [loading, data.projects.length, data.posts.length, fetchAll])

  const counts = useMemo(() => ({
    projects: data.projects.length,
    posts: data.posts.length,
    pages: data.pages.length,
    categories: data.categories.length,
    comments: data.comments.filter(c => c.status === 'pending').length,
    media: data.media.length,
  }), [data])

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar section={section} setSection={setSection} counts={counts} mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="h-full flex items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)}><Menu className="h-4 w-4" /></Button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Panel admina</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium capitalize">{NAV.find(n => n.id === section)?.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm">
                <a href="/" target="_blank"><Home className="h-3.5 w-3.5 mr-1.5" /> Zobacz stronę</a>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {section === 'dashboard' && <Dashboard data={data} onSeed={async () => {
                  toast.loading('Ładowanie danych demo...')
                  await fetch('/api/seed-all', { method: 'POST' })
                  await fetchAll()
                  toast.success('Dane demo załadowane')
                }} />}
                {section === 'projects' && <ProjectsSection projects={data.projects} onChange={fetchAll} />}
                {section === 'posts' && <PostsSection posts={data.posts} categories={data.categories} onChange={fetchAll} />}
                {section === 'pages' && <PagesSection pages={data.pages} onChange={fetchAll} />}
                {section === 'categories' && <CategoriesSection categories={data.categories} onChange={fetchAll} />}
                {section === 'comments' && <CommentsSection comments={data.comments} onChange={fetchAll} />}
                {section === 'media' && <MediaSection media={data.media} onChange={fetchAll} />}
                {section === 'settings' && <SettingsSection settings={data.settings} onChange={fetchAll} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CMSApp />
    </ThemeProvider>
  )
}
