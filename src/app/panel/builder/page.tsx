import type { Metadata } from "next";
import Link from "next/link";
import { Layers, PlusCircle, ExternalLink, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Builder" };

async function getBuilderPages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("builder_pages")
    .select("id, demo_id, name, updated_at, demos(title)")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

async function getAvailableDemos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("demos")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export default async function PanelBuilderPage() {
  const [pages, demos] = await Promise.all([getBuilderPages(), getAvailableDemos()]);

  const pagesMap = new Map(pages.map((p: Record<string, unknown>) => [p.demo_id as string, p]));
  const demosWithoutPage = demos.filter((d: Record<string, unknown>) => !pagesMap.has(d.id as string));

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Builder</h1>
          <p className="crm-page-desc">Kreator stron drag &amp; drop</p>
        </div>
        <Link href="/panel/sekcje" className="crm-btn crm-btn--primary crm-btn--sm">
          Biblioteka sekcji →
        </Link>
      </div>

      {/* Existing builder pages */}
      {pages.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="crm-section-title" style={{ marginBottom: ".75rem" }}>Strony w budowie</h2>
          <div className="builder-pages-grid">
            {pages.map((page: Record<string, unknown>) => {
              const demoName = ((page.demos as Record<string, unknown> | null)?.title as string) ?? "Demo";
              return (
                <Link
                  key={page.id as string}
                  href={`/panel/builder/${page.demo_id as string}`}
                  className="builder-page-card"
                >
                  <div className="builder-page-card-icon">
                    <Layers size={20} strokeWidth={1.2} />
                  </div>
                  <div className="builder-page-card-info">
                    <span className="builder-page-card-name">{demoName}</span>
                    <span className="builder-page-card-meta">
                      <Clock size={11} />
                      {new Date(page.updated_at as string).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  <ExternalLink size={14} className="builder-page-card-arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Demos without a builder page */}
      <div>
        <h2 className="crm-section-title" style={{ marginBottom: ".75rem" }}>
          {pages.length > 0 ? "Pozostałe demo" : "Wybierz demo do edycji"}
        </h2>
        {demosWithoutPage.length === 0 && pages.length === 0 ? (
          <div className="panel-card" style={{ padding: "3rem", textAlign: "center" }}>
            <Layers size={40} strokeWidth={1.2} style={{ opacity: .2, margin: "0 auto 1rem", display: "block" }} />
            <p className="crm-placeholder-text">Brak demo do edycji</p>
            <Link href="/panel/demo/nowe" className="crm-btn crm-btn--primary crm-btn--sm" style={{ marginTop: ".75rem", display: "inline-flex" }}>
              <PlusCircle size={13} />
              Utwórz pierwsze demo
            </Link>
          </div>
        ) : (
          <div className="builder-pages-grid">
            {demosWithoutPage.map((demo: Record<string, unknown>) => (
              <Link
                key={demo.id as string}
                href={`/panel/builder/${demo.id as string}`}
                className="builder-page-card builder-page-card--new"
              >
                <div className="builder-page-card-icon builder-page-card-icon--new">
                  <PlusCircle size={20} strokeWidth={1.2} />
                </div>
                <div className="builder-page-card-info">
                  <span className="builder-page-card-name">{(demo.title as string) || "Demo"}</span>
                  <span className="builder-page-card-meta">Zacznij budować</span>
                </div>
                <ExternalLink size={14} className="builder-page-card-arrow" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
