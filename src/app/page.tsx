'use client'

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider, useTheme } from 'next-themes'
import {
  Plus, Search, ExternalLink, Github, Pencil, Trash2, X,
  Code2, Sparkles, Calendar, ArrowUpRight, Eye, EyeOff,
  Sun, Moon, Filter, LayoutGrid, Star, FileText, Layers,
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
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

// ---------- Types ----------
type Project = {
  id: string
  title: string
  summary: string
  description: string
  techStack: string
  demoUrl: string | null
  repoUrl: string | null
  imageUrl: string | null
  status: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

type ProjectFormData = {
  title: string
  summary: string
  description: string
  techStack: string[]
  demoUrl: string
  repoUrl: string
  imageUrl: string
  status: 'draft' | 'published'
  featured: boolean
}

const EMPTY_FORM: ProjectFormData = {
  title: '', summary: '', description: '', techStack: [],
  demoUrl: '', repoUrl: '', imageUrl: '', status: 'published', featured: false,
}

// ---------- Theme toggle ----------
// useMounted: avoids setState-in-effect lint warning by using useSyncExternalStore
const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // client snapshot: always mounted
    () => false  // server snapshot: never mounted
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Zmień motyw"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

// ---------- Helpers ----------
function parseTechStack(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pl-PL', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  } catch {
    return ''
  }
}

const ACCENT_COLORS = [
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
  'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
]

function techBadgeClass(tech: string): string {
  let h = 0
  for (let i = 0; i < tech.length; i++) h = (h * 31 + tech.charCodeAt(i)) >>> 0
  return ACCENT_COLORS[h % ACCENT_COLORS.length]
}

// ---------- Project Card ----------
function ProjectCard({
  project, onEdit, onDelete, onView, isAdmin,
}: {
  project: Project
  onEdit: () => void
  onDelete: () => void
  onView: () => void
  isAdmin: boolean
}) {
  const techs = parseTechStack(project.techStack)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group relative overflow-hidden h-full flex flex-col p-0 hover:shadow-lg transition-shadow duration-300">
        {/* Cover */}
        <button
          onClick={onView}
          className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-muted via-muted/50 to-muted text-left"
          aria-label={`Zobacz ${project.title}`}
        >
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Layers className="h-10 w-10 opacity-40" />
                <span className="text-xs uppercase tracking-wider">Brak podglądu</span>
              </div>
            </div>
          )}
          {/* Badges over cover */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <Badge variant="secondary" className="bg-amber-500/90 text-white border-0 backdrop-blur">
                <Star className="h-3 w-3 mr-1 fill-current" /> Wyróżniony
              </Badge>
            )}
            {project.status === 'draft' && (
              <Badge variant="secondary" className="bg-zinc-900/80 text-white border-0 backdrop-blur">
                <EyeOff className="h-3 w-3 mr-1" /> Szkic
              </Badge>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
            <span className="text-white text-xs flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-1 rounded-md">
              <Eye className="h-3 w-3" /> Podgląd
            </span>
          </div>
        </button>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-start justify-between gap-2">
            <button onClick={onView} className="text-left">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              {project.demoUrl && (
                <a
                  href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Demo"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Repo"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>

          {techs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {techs.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-md border font-medium',
                    techBadgeClass(t)
                  )}
                >
                  {t}
                </span>
              ))}
              {techs.length > 4 && (
                <span className="text-[11px] px-2 py-0.5 text-muted-foreground">
                  +{techs.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(project.createdAt)}
            </span>
            {isAdmin && (
              <div className="flex gap-1">
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={onEdit} aria-label="Edytuj"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={onDelete} aria-label="Usuń"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ---------- Project Form Dialog ----------
function ProjectFormDialog({
  open, onOpenChange, initial, onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: Project | null
  onSave: (data: ProjectFormData) => Promise<void>
}) {
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM)
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        summary: initial.summary,
        description: initial.description,
        techStack: parseTechStack(initial.techStack),
        demoUrl: initial.demoUrl ?? '',
        repoUrl: initial.repoUrl ?? '',
        imageUrl: initial.imageUrl ?? '',
        status: initial.status as 'draft' | 'published',
        featured: initial.featured,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setTechInput('')
  }, [initial, open])

  const addTech = () => {
    const t = techInput.trim().replace(/,$/, '')
    if (t && !form.techStack.includes(t)) {
      setForm({ ...form, techStack: [...form.techStack, t] })
      setTechInput('')
    }
  }

  const removeTech = (t: string) => {
    setForm({ ...form, techStack: form.techStack.filter((x) => x !== t) })
  }

  const handleTechKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTech()
    }
  }

  const submit = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      toast.error('Tytuł i podsumowanie są wymagane')
      return
    }
    setSaving(true)
    try {
      await onSave(form)
      onOpenChange(false)
    } catch (e) {
      console.error(e)
      toast.error('Nie udało się zapisać projektu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edytuj projekt' : 'Dodaj nowy projekt'}</DialogTitle>
          <DialogDescription>
            {initial
              ? 'Zmień dane projektu. Zmiany zapiszą się po kliknięciu „Zapisz".'
              : 'Wypełnij formularz, aby dodać projekt do portfolio.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Tytuł *</Label>
            <Input
              id="title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="np. TaskFlow"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="summary">Podsumowanie *</Label>
            <Input
              id="summary" value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Krótki opis w 1 zdaniu"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Opis (Markdown)</Label>
            <Textarea
              id="description" value={form.description} rows={5}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="## O projekcie&#10;&#10;Opisz szczegóły, funkcje, użyte technologie..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" /> Obsługuje Markdown
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Stack technologiczny</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKey}
                placeholder="Wpisz i naciśnij Enter (np. React)"
              />
              <Button type="button" variant="secondary" onClick={addTech}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {form.techStack.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t}
                    <button onClick={() => removeTech(t)} aria-label={`Usuń ${t}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="demoUrl">URL demo</Label>
              <Input
                id="demoUrl" value={form.demoUrl}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repoUrl">URL repo</Label>
              <Input
                id="repoUrl" value={form.repoUrl}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageUrl">URL obrazka</Label>
            <Input
              id="imageUrl" value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://.../screenshot.png"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pt-2 border-t">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as 'draft' | 'published' })}
              >
                <SelectTrigger id="status" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> Opublikowany
                    </span>
                  </SelectItem>
                  <SelectItem value="draft">
                    <span className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4" /> Szkic
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pb-2">
              <Switch
                id="featured" checked={form.featured}
                onCheckedChange={(c) => setForm({ ...form, featured: c })}
              />
              <Label htmlFor="featured" className="flex items-center gap-1.5 cursor-pointer">
                <Star className="h-4 w-4 text-amber-500" /> Wyróżnij
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Zapisywanie...' : initial ? 'Zapisz zmiany' : 'Dodaj projekt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------- Project Detail Dialog ----------
function ProjectDetailDialog({
  project, open, onOpenChange,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!project) return null
  const techs = parseTechStack(project.techStack)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription className="text-base">{project.summary}</DialogDescription>
        </DialogHeader>

        {project.imageUrl && (
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border bg-muted">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}

        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techs.map((t) => (
              <span
                key={t}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-md border font-medium',
                  techBadgeClass(t)
                )}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {project.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:text-primary prose-code:before:hidden prose-code:after:hidden prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
            <ReactMarkdown>{project.description}</ReactMarkdown>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {project.demoUrl && (
            <Button asChild size="sm">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1.5" /> Zobacz demo
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button asChild size="sm" variant="outline">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-1.5" /> Kod źródłowy
              </a>
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
          <Calendar className="h-3 w-3" />
          Dodano {formatDate(project.createdAt)}
          {project.updatedAt !== project.createdAt && (
            <span className="ml-2">· Zaktualizowano {formatDate(project.updatedAt)}</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------- Main App ----------
function PortfolioApp() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [sortMode, setSortMode] = useState<'recent' | 'featured'>('recent')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [viewing, setViewing] = useState<Project | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (isAdmin) params.set('status', 'all')
      else params.set('status', 'published')
      const res = await fetch(`/api/projects?${params}`)
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      console.error(e)
      toast.error('Nie udało się pobrać projektów')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  // Auto-seed on first mount if empty
  useEffect(() => {
    if (!loading && projects.length === 0 && !isAdmin) {
      fetch('/api/projects/seed', { method: 'POST' })
        .then(() => fetchProjects())
        .catch(() => {})
    }
  }, [loading, projects.length, isAdmin, fetchProjects])

  const filtered = useMemo(() => {
    let list = [...projects]
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        parseTechStack(p.techStack).some((t) => t.toLowerCase().includes(q))
      )
    }
    if (sortMode === 'featured') {
      list.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        return a.order - b.order
      })
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return list
  }, [projects, search, statusFilter, sortMode])

  const featured = useMemo(() => filtered.filter((p) => p.featured).slice(0, 1)[0], [filtered])
  const restProjects = useMemo(() => {
    if (sortMode !== 'featured' || !featured) return filtered
    return filtered.filter((p) => p.id !== featured.id)
  }, [filtered, featured, sortMode])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setFormOpen(true)
  }

  const openView = (p: Project) => {
    setViewing(p)
    setViewOpen(true)
  }

  const handleSave = async (data: ProjectFormData) => {
    if (editing) {
      const res = await fetch(`/api/projects/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('update failed')
      toast.success('Projekt zaktualizowany')
    } else {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('create failed')
      toast.success('Projekt dodany')
    }
    await fetchProjects()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      toast.success('Projekt usunięty')
      setDeleteTarget(null)
      await fetchProjects()
    } catch (e) {
      console.error(e)
      toast.error('Nie udało się usunąć projektu')
    }
  }

  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter((p) => p.status === 'published').length,
    drafts: projects.filter((p) => p.status === 'draft').length,
    featured: projects.filter((p) => p.featured).length,
  }), [projects])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h1 className="font-semibold text-base sm:text-lg">Portfolio CMS</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Zarządzaj swoimi projektami
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant={isAdmin ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              {isAdmin ? 'Tryb edycji' : 'Panel admina'}
            </Button>
            {isAdmin && (
              <Button size="sm" onClick={openNew}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Dodaj
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="border-b border-border/40 bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3" /> Twoje projekty
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
              Pokaż światu, co potrafisz zbudować.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
              Wszystkie Twoje projekty w jednym miejscu. Dodawaj, edytuj i udostępniaj
              swoje realizacje — od pomysłu po wdrożenie.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Wszystkie" value={stats.total} icon={<LayoutGrid className="h-4 w-4" />} />
              <StatCard label="Opublikowane" value={stats.published} icon={<Eye className="h-4 w-4" />} />
              <StatCard label="Szkice" value={stats.drafts} icon={<EyeOff className="h-4 w-4" />} />
              <StatCard label="Wyróżnione" value={stats.featured} icon={<Star className="h-4 w-4" />} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Filters ---------- */}
      <section className="sticky top-[65px] z-30 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj po tytule, opisie lub technologii..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="published">Opublikowane</SelectItem>
                  <SelectItem value="draft">Szkice</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={sortMode} onValueChange={(v) => setSortMode(v as typeof sortMode)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Najnowsze</SelectItem>
                <SelectItem value="featured">Wyróżnione pierwsze</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ---------- Main ---------- */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState isAdmin={isAdmin} onAdd={openNew} hasSearch={!!search} />
          ) : (
            <div className="space-y-8">
              {/* Featured banner */}
              {featured && sortMode === 'featured' && (
                <FeaturedBanner project={featured} onView={openView} isAdmin={isAdmin} onEdit={openEdit} />
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {restProjects.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      isAdmin={isAdmin}
                      onView={() => openView(p)}
                      onEdit={() => openEdit(p)}
                      onDelete={() => setDeleteTarget(p)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>Portfolio CMS · Zbudowane z Next.js + Prisma</p>
          <div className="flex items-center gap-2">
            <span>{filtered.length} {filtered.length === 1 ? 'projekt' : 'projektów'}</span>
          </div>
        </div>
      </footer>

      {/* ---------- Dialogs ---------- */}
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSave={handleSave}
      />

      <ProjectDetailDialog
        project={viewing}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć projekt?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć <strong>{deleteTarget?.title}</strong>?
              Tej operacji nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ---------- Stat Card ----------
function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div>
        <div className="text-xl font-semibold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  )
}

// ---------- Featured Banner ----------
function FeaturedBanner({
  project, onView, isAdmin, onEdit,
}: {
  project: Project
  onView: () => void
  isAdmin: boolean
  onEdit: () => void
}) {
  const techs = parseTechStack(project.techStack)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden p-0 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card">
        <div className="grid md:grid-cols-2 gap-0">
          <button
            onClick={onView}
            className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] bg-muted overflow-hidden text-left"
          >
            {project.imageUrl ? (
              <img
                src={project.imageUrl} alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Layers className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-amber-500/90 text-white border-0">
              <Star className="h-3 w-3 mr-1 fill-current" /> Wyróżniony
            </Badge>
          </button>
          <div className="p-6 flex flex-col justify-center gap-3">
            <h3 className="text-2xl font-bold">{project.title}</h3>
            <p className="text-muted-foreground">{project.summary}</p>
            {techs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {techs.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-md border font-medium',
                      techBadgeClass(t)
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" onClick={onView}>
                <Eye className="h-4 w-4 mr-1.5" /> Zobacz szczegóły
              </Button>
              {project.demoUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1.5" /> Demo
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              {isAdmin && (
                <Button size="sm" variant="ghost" onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-1.5" /> Edytuj
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ---------- Empty State ----------
function EmptyState({
  isAdmin, onAdd, hasSearch,
}: {
  isAdmin: boolean
  onAdd: () => void
  hasSearch: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Layers className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {hasSearch ? 'Brak wyników' : 'Brak projektów'}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {hasSearch
          ? 'Nie znaleziono projektów spełniających kryteria. Zmień zapytanie lub filtry.'
          : isAdmin
          ? 'Dodaj swój pierwszy projekt, aby zapełnić portfolio.'
          : 'Portfolio jest na razie puste. Włącz panel admina, aby dodać projekty.'}
      </p>
      {isAdmin && !hasSearch && (
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1.5" /> Dodaj pierwszy projekt
        </Button>
      )}
    </div>
  )
}

// ---------- Page Export ----------
export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <PortfolioApp />
    </ThemeProvider>
  )
}
