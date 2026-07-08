import type { Metadata } from "next";
import Link from "next/link";
import { Users, FolderOpen, Calculator, Globe, Bot, AlertTriangle, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RecentTable, type RecentItem } from "@/components/dashboard/recent-table";
import { WidgetTasks } from "@/components/dashboard/widget-tasks";
import { WidgetNotes } from "@/components/dashboard/widget-notes";
import { WidgetCalendar, type CalendarItem } from "@/components/dashboard/widget-calendar";
import { getDashboardData } from "@/features/dashboard/queries/dashboard-queries";
import { getUpcomingDeadlines } from "@/features/projects/queries/project-queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function PanelDashboard() {
  const [{ data, error }, upcomingDeadlines] = await Promise.all([
    getDashboardData(),
    getUpcomingDeadlines(5),
  ]);

  const calendarItems: CalendarItem[] = upcomingDeadlines.map((p) => ({
    id: p.id,
    label: p.name,
    deadline: p.deadline,
    href: `/panel/projekty/${p.id}`,
    status: p.status,
  }));
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Dzień dobry" : hour < 18 ? "Cześć" : "Dobry wieczór";
  const stats = [
    { label: "Klienci", value: data.stats.clients, sub: "w bazie CRM", icon: <Users size={14} /> },
    { label: "Aktywne projekty", value: data.stats.projects, sub: "w trakcie realizacji", icon: <FolderOpen size={14} /> },
    { label: "Wyceny", value: data.stats.estimates, sub: `${data.stats.pendingEstimates} oczekuje`, icon: <Calculator size={14} /> },
    { label: "Aktywne demo", value: data.stats.activeDemos, sub: `${data.stats.demos} łącznie`, icon: <Globe size={14} /> },
    { label: "Wyniki AI", value: data.stats.aiOutputs, sub: "wygenerowane treści", icon: <Bot size={14} /> },
    ...(data.stats.aiErrors > 0 ? [{ label: "Błędy AI", value: data.stats.aiErrors, sub: "wymagają uwagi", icon: <AlertTriangle size={14} /> }] : []),
  ];

  return (
    <>
      {/* Hero */}
      <div className="panel-dash-hero panel-enter">
        <h1 className="panel-dash-hero-greeting">
          {greeting}, <em>Marek.</em>
        </h1>
        <p className="panel-dash-hero-meta">
          Twoje studio jest aktywne. Sprawdź co nowego.
        </p>
      </div>

      {/* Quick actions */}
      <div className="panel-enter panel-enter-1">
        <QuickActions />
      </div>

      {/* Studio Banner */}
      <div className="panel-enter panel-enter-1 mb-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Sparkles className="text-primary h-5 w-5" />
              AI Website Studio jest już dostępne
            </h2>
            <p className="text-muted-foreground text-sm">
              Pełen pakiet narzędzi Visual Builder, Animation Studio, wbudowane szablony i kreator komponentów.
            </p>
          </div>
          <Link
            href="/panel/studio"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Przejdź do Studio
          </Link>
        </div>
      </div>

      {error && (
        <div className="panel-error panel-enter panel-enter-1">
          <p>Supabase nie zwrócił danych dashboardu: {error}</p>
        </div>
      )}

      {/* Stat cards */}
      <div className="panel-stat-grid panel-enter panel-enter-2">
        {stats.map(({ label, value, sub, icon }) => (
          <StatCard key={label} label={label} value={value} sub={sub} icon={icon} />
        ))}
      </div>

      {/* Main columns: activity + recent clients */}
      <div className="panel-dash-cols panel-enter panel-enter-3">
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Ostatnia aktywność</span>
          </div>
          <div className="panel-card-body">
            <ActivityFeed items={data.activity} />
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Ostatni klienci</span>
            <Link href="/panel/klienci" className="panel-card-action">
              Zobacz wszystkich →
            </Link>
          </div>
          <div className="panel-card-body">
            <RecentTable items={data.recentClients as RecentItem[]} />
          </div>
        </div>
      </div>

      {/* Recent estimates */}
      <div className="panel-card panel-enter panel-enter-4" style={{ marginBottom: "1.25rem" }}>
        <div className="panel-card-header">
          <span className="panel-card-title">Ostatnie wyceny</span>
          <Link href="/panel/wyceny" className="panel-card-action">
            Zobacz wszystkie →
          </Link>
        </div>
        <div className="panel-card-body">
          <RecentTable items={data.recentEstimates as RecentItem[]} />
        </div>
      </div>

      {/* AI Hub quick block */}
      <div className="panel-dash-ai panel-enter panel-enter-4">
        <div className="panel-card panel-dash-ai-tools">
          <div className="panel-card-header">
            <span className="panel-card-title">Narzędzia AI</span>
            <Link href="/panel/ai/narzedzia" className="panel-card-action">Wszystkie →</Link>
          </div>
          <div className="panel-card-body">
            <div className="crm-quick-actions" style={{ gap: ".5rem" }}>
              <Link href="/panel/ai/narzedzia/generator-nazwy-firmy" className="crm-action-link">Generator nazwy firmy</Link>
              <Link href="/panel/ai/narzedzia/generator-tekstow-na-strone" className="crm-action-link">Generator tekstów na stronę</Link>
              <Link href="/panel/ai/narzedzia/generator-seo" className="crm-action-link">Generator SEO</Link>
              <Link href="/panel/ai/narzedzia/generator-postow-social" className="crm-action-link">Generator postów social</Link>
              <Link href="/panel/ai/narzedzia/generator-regulaminu" className="crm-action-link">Generator regulaminu</Link>
              <Link href="/panel/ai/narzedzia/audyt-strony" className="crm-action-link">Audyt strony</Link>
            </div>
          </div>
        </div>

        {data.recentAIOutputs.length > 0 && (
          <div className="panel-card">
            <div className="panel-card-header">
              <span className="panel-card-title">Ostatnie wyniki AI</span>
              <Link href="/panel/ai/wyniki" className="panel-card-action">Historia →</Link>
            </div>
            <div className="panel-card-body" style={{ padding: 0 }}>
              {data.recentAIOutputs.map((o) => (
                <div key={o.id} className="pa-recent-item">
                  <div>
                    <p style={{ fontSize: ".75rem", fontWeight: 600 }}>{o.tool_name}</p>
                    <p className="crm-td-muted" style={{ fontSize: ".65rem" }}>
                      {new Date(o.created_at).toLocaleString("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })} · {o.provider}
                    </p>
                  </div>
                  <span className="crm-badge crm-badge--sm ai-badge--completed">✓</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Widgets */}
      <div className="panel-dash-widgets panel-enter panel-enter-5">
        <WidgetTasks />
        <WidgetNotes />
        <WidgetCalendar items={calendarItems} />
      </div>
    </>
  );
}
