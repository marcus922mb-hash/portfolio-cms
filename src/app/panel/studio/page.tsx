import Link from "next/link";
import {
    Wand2,
    MonitorPlay,
    Component,
    Film,
    Palette,
    LayoutTemplate,
    Image as ImageIcon,
    Search,
    Code2
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

export default function StudioHubPage() {
    const tools = [
        {
            title: "Visual Builder",
            description: "Profesjonalny edytor drag & drop (Grid, Flexbox, Auto Layout).",
            icon: MonitorPlay,
            href: "/panel/studio/visual-builder",
            color: "#3b82f6",
        },
        {
            title: "Component Builder",
            description: "Zarządzaj potężną biblioteką ponad 100 komponentów.",
            icon: Component,
            href: "/panel/studio/components",
            color: "#10b981",
        },
        {
            title: "Animation Studio",
            description: "Twórz i przypisuj mikro-animacje, przejścia, scroll effects.",
            icon: Film,
            href: "/panel/studio/animations",
            color: "#f59e0b",
        },
        {
            title: "Theme Builder",
            description: "Globalne ustawienia kolorów, typografii i motywów (Dark/Light).",
            icon: Palette,
            href: "/panel/studio/themes",
            color: "#d946ef",
        },
        {
            title: "Template Builder",
            description: "Gotowe szablony stron dla dziesiątek branż (Restauracja, SaaS, itp.).",
            icon: LayoutTemplate,
            href: "/panel/studio/templates",
            color: "#8b5cf6",
        },
        {
            title: "Media Studio",
            description: "Zarządzanie obrazami, kompresja AI, optymalizacja SVG / WebP.",
            icon: ImageIcon,
            href: "/panel/studio/media",
            color: "#06b6d4",
        },
        {
            title: "SEO Studio",
            description: "Generator metadanych, optymalizacja schema, analiza konkurencji.",
            icon: Search,
            href: "/panel/studio/seo",
            color: "#eab308",
        },
        {
            title: "Code Studio",
            description: "Dodawaj niestandardowy kod, pracuj w trybie developerskim (Monaco).",
            icon: Code2,
            href: "/panel/studio/code",
            color: "#64748b",
        },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="panel-enter">
                <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                    <Wand2 className="text-primary" /> AI Website Studio
                </h1>
                <p className="text-muted-foreground">
                    Rozbudowana platforma do pełnego projektowania, generowania i publikacji witryn internetowych. Wybierz moduł, nad którym chcesz pracować.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 panel-enter panel-enter-1">
                <StatCard label="Dostępnych komponentów" value={142} sub="W 30+ kategoriach" />
                <StatCard label="Szablonów branżowych" value={45} sub="Gotowe do modyfikacji" />
                <StatCard label="Animacji" value={86} sub="Framer Motion + CSS" />
                <StatCard label="Wygenerowanych stron AI" value={214} sub="Przez wszystkich klientów" />
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 panel-enter panel-enter-2">
                {tools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                    >
                        <div className="mb-4">
                            <div
                                className="mb-4 inline-flex rounded-lg p-3"
                                style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                            >
                                <tool.icon size={24} />
                            </div>
                            <h3 className="mb-2 font-semibold tracking-tight">{tool.title}</h3>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>

                        <div className="flex items-center text-sm font-medium" style={{ color: tool.color }}>
                            Zarządzaj
                            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
