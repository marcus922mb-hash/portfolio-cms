import Link from 'next/link'
import { db } from '@/lib/db'
import { ArrowLeft, Clock, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

function formatDate(iso?: string | Date | null): string {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return '—' }
}

export default async function BlogPage() {
    const posts = await db.post.findMany({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        include: { category: true }
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

            <main className="max-w-4xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog & Wiedza</h1>
                    <p className="text-xl text-muted-foreground">Myśli, artykuły i notatki ze świata developmentu.</p>
                </div>

                {posts.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground border border-dashed rounded-3xl bg-muted/20">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Brak opublikowanych wpisów.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map(post => (
                            <article key={post.id} className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-3xl border border-border bg-card hover:shadow-xl transition-all duration-300">
                                {post.featuredImage && (
                                    <div className="w-full md:w-1/3 aspect-[16/9] md:aspect-square rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col">
                                    {post.category && (
                                        <Badge variant="secondary" className="w-fit mb-3" style={{ backgroundColor: post.category.color + '20', color: post.category.color }}>
                                            {post.category.name}
                                        </Badge>
                                    )}
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/40">
                                        <div className="flex items-center gap-1.5 focus:outline-none">
                                            <Clock className="w-4 h-4" /> {formatDate(post.publishedAt || post.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
