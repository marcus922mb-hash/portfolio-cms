import Link from 'next/link'
import { db } from '@/lib/db'
import { ArrowLeft, ExternalLink, Github, Star, FolderKanban } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

function parseTechStack(raw: string): string[] {
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [] } catch { return [] }
}

const ACCENT = [
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
    'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
    'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
]
function techBadgeClass(t: string) { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return ACCENT[h % ACCENT.length] }

export default async function ProjectsPage() {
    const projects = await db.project.findMany({
        where: { status: 'published' },
        orderBy: { order: 'asc' }
    })

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <ArrowLeft className="w-4 h-4" /> Wróć do strony głównej
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Portfolio</h1>
                    <p className="text-xl text-muted-foreground">Oto wybrane realizacje, nad którymi pracowałem.</p>
                </div>

                {projects.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground border border-dashed rounded-3xl bg-muted/20">
                        <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Brak opublikowanych projektów.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map(project => {
                            const techs = parseTechStack(project.techStack)
                            return (
                                <div key={project.id} className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <FolderKanban className="w-12 h-12 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        {project.featured && (
                                            <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm">
                                                <Star className="h-3.5 w-3.5 mr-1 fill-current" /> Wyróżniony
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                            {project.summary}
                                        </p>
                                        {techs.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {techs.slice(0, 4).map(t => (
                                                    <span key={t} className={`text-[10px] px-2 py-1 rounded-md font-medium border ${techBadgeClass(t)}`}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                                            {project.demoUrl ? (
                                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                                                    <ExternalLink className="w-4 h-4 mr-1.5" /> Podgląd
                                                </a>
                                            ) : null}
                                            {project.repoUrl ? (
                                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                                                    <Github className="w-4 h-4 mr-1.5" /> Kod
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
