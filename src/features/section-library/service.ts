import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getSectionLibraryCategories,
  getSectionLibraryLicenses,
  getSectionLibraryPageTemplates,
  getSectionLibrarySeeds,
  getSectionLibrarySources,
} from "@/features/section-library/catalog";
import type {
  GitHubRepositoryInput,
  GeneratedPageRecord,
  SectionPageTemplate,
  SectionRecord,
  SectionSource,
  SectionVariant,
} from "@/features/section-library/types";
import { sectionRecordToDbPayload, sectionRowToRecord } from "@/features/section-library/types";
import { scanGitHubRepository } from "@/features/section-library/github";
import { nowIso } from "@/features/section-library/utils";
import { localConvertSection, localGenerateSimilarSection, localImproveSection } from "@/features/section-library/analysis";
import type { Database } from "@/types/database";

type Snapshot = {
  sections: SectionRecord[];
  sources: SectionSource[];
  templates: SectionPageTemplate[];
  licenses: ReturnType<typeof getSectionLibraryLicenses>;
  categories: ReturnType<typeof getSectionLibraryCategories>;
};

let bootstrapPromise: Promise<void> | null = null;

function sourceRowToRecord(row: Record<string, unknown>): SectionSource {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    githubUrl: String(row.github_url ?? ""),
    technology: String(row.technology ?? ""),
    license: String(row.license ?? "Wymaga sprawdzenia"),
    author: (row.author as string | null) ?? null,
    lastSyncedAt: (row.last_synced_at as string | null) ?? null,
    componentCount: Number(row.component_count ?? 0),
    sectionCount: Number(row.section_count ?? 0),
    syncStatus: String(row.sync_status ?? "idle") as SectionSource["syncStatus"],
    autoSync: Boolean(row.auto_sync ?? true),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    categories: Array.isArray(row.categories) ? (row.categories as SectionSource["categories"]) : [],
    thumbnailUrl: (row.thumbnail_url as string | null) ?? null,
  };
}

function sourceRecordToDb(source: SectionSource) {
  return {
    id: source.id,
    name: source.name,
    description: source.description,
    github_url: source.githubUrl,
    technology: source.technology,
    license: source.license,
    author: source.author,
    last_synced_at: source.lastSyncedAt,
    component_count: source.componentCount,
    section_count: source.sectionCount,
    sync_status: source.syncStatus,
    auto_sync: source.autoSync,
    tags: source.tags,
    categories: source.categories,
    thumbnail_url: source.thumbnailUrl,
  };
}

function templateRowToRecord(row: Record<string, unknown>): SectionPageTemplate {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    industry: String(row.industry ?? ""),
    style: String(row.style ?? ""),
    description: String(row.description ?? ""),
    sectionIds: Array.isArray(row.section_ids) ? (row.section_ids as string[]) : [],
    seoTitle: String(row.seo_title ?? ""),
    seoDescription: String(row.seo_description ?? ""),
    thumbnailUrl: (row.thumbnail_url as string | null) ?? "",
    status: String(row.status ?? "active") as SectionPageTemplate["status"],
    isPremium: Boolean(row.is_premium ?? false),
  };
}

function templateRecordToDb(template: SectionPageTemplate) {
  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    industry: template.industry,
    style: template.style,
    description: template.description,
    section_ids: template.sectionIds,
    seo_title: template.seoTitle,
    seo_description: template.seoDescription,
    thumbnail_url: template.thumbnailUrl,
    status: template.status,
    is_premium: template.isPremium,
  };
}

function generatedPageRecordToDb(page: GeneratedPageRecord) {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    template_id: page.templateId,
    status: page.status,
    seo_title: page.seoTitle,
    seo_description: page.seoDescription,
    section_ids: page.sectionIds,
    created_at: page.createdAt,
    updated_at: page.updatedAt,
    published_at: page.publishedAt,
  };
}

function licenseRecordToDb(license: ReturnType<typeof getSectionLibraryLicenses>[number]) {
  return {
    id: license.id,
    name: license.name,
    is_free: license.isFree,
    commercial_use: license.commercialUse,
    attribution_required: license.attributionRequired,
    source_url: license.sourceUrl ?? null,
    author: license.author ?? null,
    status: license.status,
  };
}

function categoryRecordToDb(category: ReturnType<typeof getSectionLibraryCategories>[number], index: number) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    tags: category.tags,
    sort_order: (index + 1) * 10,
    is_active: true,
  };
}

async function bootstrapSectionLibrary() {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const supabase = createAdminClient();
    const sections = getSectionLibrarySeeds();
    const sources = getSectionLibrarySources();
    const templates = getSectionLibraryPageTemplates();
    const licenses = getSectionLibraryLicenses();
    const categories = getSectionLibraryCategories();

    const sectionPayloads = sections.map((section) => sectionRecordToDbPayload(section)) as Database["public"]["Tables"]["sections"]["Insert"][];
    const componentPayloads = sections.map((section) => {
      const payload = sectionRecordToDbPayload(section);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { variants: _v, ...componentPayload } = payload;
      return componentPayload;
    }) as Database["public"]["Tables"]["components"]["Insert"][];
    const variantPayloads = sections.flatMap((section) =>
      (section.variants ?? []).map((variant) => ({
        id: variant.id,
        section_id: variant.sectionId,
        name: variant.name,
        variant_key: variant.key,
        component_code: variant.componentCode,
        style_code: variant.styleCode,
        thumbnail_url: variant.thumbnailUrl ?? null,
        notes: variant.notes ?? null,
        is_default: variant.isDefault,
      }))
    ) as Database["public"]["Tables"]["section_variants"]["Insert"][];
    const licensePayloads = licenses.map(licenseRecordToDb) as Database["public"]["Tables"]["component_licenses"]["Insert"][];
    const categoryPayloads = categories.map(categoryRecordToDb) as Database["public"]["Tables"]["section_categories"]["Insert"][];
    const sourcePayloads = sources.map(sourceRecordToDb) as Database["public"]["Tables"]["section_sources"]["Insert"][];
    const templatePayloads = templates.map(templateRecordToDb) as Database["public"]["Tables"]["page_templates"]["Insert"][];

    await Promise.all([
      supabase.from("component_licenses").upsert(licensePayloads, { onConflict: "id" }),
      supabase.from("section_categories").upsert(categoryPayloads, { onConflict: "id" }),
      supabase.from("section_sources").upsert(sourcePayloads, { onConflict: "id" }),
      supabase.from("page_templates").upsert(templatePayloads, { onConflict: "id" }),
      sectionPayloads.length > 0 ? supabase.from("sections").upsert(sectionPayloads, { onConflict: "id" }) : Promise.resolve(null),
      componentPayloads.length > 0 ? supabase.from("components").upsert(componentPayloads, { onConflict: "id" }) : Promise.resolve(null),
      variantPayloads.length > 0 ? supabase.from("section_variants").upsert(variantPayloads, { onConflict: "id" }) : Promise.resolve(null),
    ]);
  })().finally(() => {
    bootstrapPromise = null;
  });

  return bootstrapPromise;
}

async function safeSelect(table: string, columns = "*") {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from(table).select(columns);
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getSectionLibrarySnapshot(): Promise<Snapshot> {
  const [sectionsData, sourcesData, templatesData] = await Promise.all([
    safeSelect("sections"),
    safeSelect("section_sources"),
    safeSelect("page_templates"),
  ]);

  if (!sectionsData || sectionsData.length === 0) {
    try {
      await bootstrapSectionLibrary();
      const [bootstrappedSections, bootstrappedSources, bootstrappedTemplates] = await Promise.all([
        safeSelect("sections"),
        safeSelect("section_sources"),
        safeSelect("page_templates"),
      ]);
      return {
        sections: bootstrappedSections && bootstrappedSections.length > 0
          ? bootstrappedSections.map((row) => sectionRowToRecord(row as Record<string, unknown>))
          : getSectionLibrarySeeds(),
        sources: bootstrappedSources && bootstrappedSources.length > 0
          ? bootstrappedSources.map((row) => sourceRowToRecord(row as Record<string, unknown>))
          : getSectionLibrarySources(),
        templates: bootstrappedTemplates && bootstrappedTemplates.length > 0
          ? bootstrappedTemplates.map((row) => templateRowToRecord(row as Record<string, unknown>))
          : getSectionLibraryPageTemplates(),
        licenses: getSectionLibraryLicenses(),
        categories: getSectionLibraryCategories(),
      };
    } catch {
      // Fall back to local seeds if Supabase bootstrap is not available.
    }
  }

  const sections = (sectionsData && sectionsData.length > 0)
    ? sectionsData.map((row) => sectionRowToRecord(row as Record<string, unknown>))
    : getSectionLibrarySeeds();
  const sources = (sourcesData && sourcesData.length > 0)
    ? sourcesData.map((row) => sourceRowToRecord(row as Record<string, unknown>))
    : getSectionLibrarySources();
  const templates = (templatesData && templatesData.length > 0)
    ? templatesData.map((row) => templateRowToRecord(row as Record<string, unknown>))
    : getSectionLibraryPageTemplates();

  return {
    sections,
    sources,
    templates,
    licenses: getSectionLibraryLicenses(),
    categories: getSectionLibraryCategories(),
  };
}

export async function getSectionById(id: string): Promise<SectionRecord | null> {
  const snapshot = await getSectionLibrarySnapshot();
  return snapshot.sections.find((section) => section.id === id) ?? null;
}

export async function saveSection(section: SectionRecord) {
  try {
    const supabase = createAdminClient();
    const payload = sectionRecordToDbPayload(section) as Database["public"]["Tables"]["sections"]["Insert"];
    const { error } = await supabase.from("sections").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true as const, section };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Nie udało się zapisać sekcji." };
  }
}

export async function deleteSection(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) throw error;
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Nie udało się usunąć sekcji." };
  }
}

export async function duplicateSection(id: string) {
  const section = await getSectionById(id);
  if (!section) return { success: false as const, error: "Nie znaleziono sekcji." };

  const duplicated: SectionRecord = {
    ...section,
    id: `${section.id}-copy-${Date.now()}`,
    slug: `${section.slug}-copy-${Date.now()}`,
    name: `${section.name} (kopiuj)`,
    dateAdded: nowIso(),
    isFavorite: false,
    previewHtml: section.previewHtml,
    previewDarkHtml: section.previewDarkHtml,
  };
  return saveSection(duplicated);
}

export async function upsertSectionVariant(sectionId: string, variant: SectionVariant) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("section_variants").upsert({
      id: variant.id,
      section_id: sectionId,
      name: variant.name,
      variant_key: variant.key,
      component_code: variant.componentCode,
      style_code: variant.styleCode,
      thumbnail_url: variant.thumbnailUrl,
      notes: variant.notes,
      is_default: variant.isDefault,
    });
    if (error) throw error;
    return { success: true as const, variant };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Nie udało się zapisać wariantu." };
  }
}

export async function importGitHubRepository(input: GitHubRepositoryInput) {
  return scanGitHubRepository(input);
}

export async function improveSection(section: SectionRecord) {
  return localImproveSection(section);
}

export async function generateSimilarSection(section: SectionRecord) {
  return localGenerateSimilarSection(section);
}

export async function convertSection(input: {
  source: string;
  from: "html" | "react" | "tailwind" | "css";
  to: "react" | "builder" | "css" | "tailwind";
}) {
  return localConvertSection(input);
}

export async function saveSource(source: SectionSource) {
  try {
    const supabase = createAdminClient();
    const payload = sourceRecordToDb(source) as Database["public"]["Tables"]["section_sources"]["Insert"];
    const { error } = await supabase.from("section_sources").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true as const, source };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Nie udało się zapisać źródła." };
  }
}

export async function saveTemplate(template: SectionPageTemplate) {
  try {
    const supabase = createAdminClient();
    const payload = templateRecordToDb(template) as Database["public"]["Tables"]["page_templates"]["Insert"];
    const { error } = await supabase.from("page_templates").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true as const, template };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Nie udało się zapisać szablonu." };
  }
}

export async function saveGeneratedPage(page: GeneratedPageRecord) {
  try {
    const supabase = createAdminClient();
    const payload = generatedPageRecordToDb(page) as Database["public"]["Tables"]["generated_pages"]["Insert"];
    const { error } = await supabase.from("generated_pages").upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return { success: true as const, page };
  } catch (error) {
    return { success: false as const, error: error instanceof Error ? error.message : "Nie udało się zapisać strony." };
  }
}
