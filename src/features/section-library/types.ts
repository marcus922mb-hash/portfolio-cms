import { z } from "zod";
import type { Json } from "@/types/database";

export const SECTION_LIBRARY_CATEGORIES = [
  "menu-i-nawigacje",
  "sekcje-hero",
  "sekcje-ofertowe",
  "sekcje-ecommerce",
  "sekcje-specjalne",
] as const;

export type SectionLibraryCategory = (typeof SECTION_LIBRARY_CATEGORIES)[number];

export const SECTION_TECHNOLOGIES = [
  "React",
  "Next.js",
  "HTML",
  "Tailwind",
  "CSS",
  "React + Tailwind",
  "Next.js + Tailwind",
  "HTML + Tailwind",
  "React + CSS",
] as const;

export type SectionTechnology = (typeof SECTION_TECHNOLOGIES)[number];

export const SECTION_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type SectionDifficulty = (typeof SECTION_DIFFICULTIES)[number];

export const SECTION_STATUS = ["active", "draft", "hidden"] as const;
export type SectionStatus = (typeof SECTION_STATUS)[number];

export const SECTION_SOURCE_TYPES = ["github", "own", "generated_ai"] as const;
export type SectionSourceType = (typeof SECTION_SOURCE_TYPES)[number];

export const SECTION_LICENSE_STATUS = ["known", "requires_check"] as const;
export type SectionLicenseStatus = (typeof SECTION_LICENSE_STATUS)[number];

export type SectionLicense = {
  id: string;
  name: string;
  isFree: boolean;
  commercialUse: boolean;
  attributionRequired: boolean;
  sourceUrl?: string | null;
  author?: string | null;
  status: SectionLicenseStatus;
};

export type SectionSource = {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  technology: string;
  license: string;
  author?: string | null;
  lastSyncedAt?: string | null;
  componentCount: number;
  sectionCount: number;
  syncStatus: "idle" | "syncing" | "synced" | "error" | "needs_review";
  autoSync: boolean;
  tags: string[];
  categories: SectionLibraryCategory[];
  thumbnailUrl?: string | null;
};

export type SectionVariant = {
  id: string;
  sectionId: string;
  name: string;
  key: string;
  componentCode: string;
  styleCode: string;
  thumbnailUrl?: string | null;
  notes?: string | null;
  isDefault: boolean;
};

export type SectionRecord = {
  id: string;
  slug: string;
  name: string;
  categoryId: SectionLibraryCategory;
  categoryName: string;
  tags: string[];
  thumbnailUrl: string;
  description: string;
  technology: SectionTechnology;
  componentCode: string;
  styleCode: string;
  dependencies: string[];
  difficulty: SectionDifficulty;
  requiresJavaScript: boolean;
  responsive: boolean;
  animated: boolean;
  sourceType: SectionSourceType;
  sourceUrl?: string | null;
  author?: string | null;
  licenseId: string;
  licenseName: string;
  licenseStatus: SectionLicenseStatus;
  isFree: boolean;
  commercialUse: boolean;
  attributionRequired: boolean;
  dateAdded: string;
  status: SectionStatus;
  industryTags: string[];
  styleTags: string[];
  isFavorite: boolean;
  isPremium: boolean;
  previewHtml: string;
  previewDarkHtml: string;
  aiAnalysis?: SectionAnalysis | null;
  variants?: SectionVariant[];
};

export type SectionCategory = {
  id: SectionLibraryCategory;
  name: string;
  description: string;
  tags: string[];
};

export type SectionAnalysis = {
  summary: string;
  sectionType: string;
  industryMatches: string[];
  responsive: boolean;
  elements: string[];
  dependencies: string[];
  security: {
    safe: boolean;
    notes: string[];
  };
  builderReady: boolean;
  simplifySuggested: boolean;
  transformNotes: string[];
};

export type SectionImportResult = {
  source: SectionSource | null;
  sections: SectionRecord[];
  variants: SectionVariant[];
  filesScanned: number;
  packageDependencies: string[];
  warnings: string[];
};

export type GitHubRepositoryInput = {
  repositoryUrl: string;
  sourceName?: string;
  sourceDescription?: string;
  license?: string;
  author?: string;
  autoSync?: boolean;
};

export type SectionPageTemplate = {
  id: string;
  slug: string;
  name: string;
  industry: string;
  style: string;
  description: string;
  sectionIds: string[];
  seoTitle: string;
  seoDescription: string;
  thumbnailUrl: string;
  status: "active" | "draft" | "hidden";
  isPremium: boolean;
};

export type GeneratedPageRecord = {
  id: string;
  title: string;
  slug: string;
  templateId: string | null;
  status: "draft" | "demo" | "template" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  sectionIds: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type SectionSourceRecord = SectionSource;

export type SectionSecurityFinding = {
  type:
    | "script"
    | "iframe"
    | "external_script"
    | "api_token"
    | "secret"
    | "suspicious_link"
    | "unsafe_js"
    | "dependency";
  severity: "low" | "medium" | "high";
  message: string;
  details?: string;
};

export type SectionSecurityReport = {
  safe: boolean;
  findings: SectionSecurityFinding[];
  riskScore: number;
  summary: string;
};

export type SectionEditorState = {
  query: string;
  category: SectionLibraryCategory | "all";
  technology: SectionTechnology | "all";
  status: SectionStatus | "all";
  sourceType: SectionSourceType | "all";
  favoritesOnly: boolean;
  premiumOnly: boolean;
};

export const sectionImportFormSchema = z.object({
  repositoryUrl: z.string().trim().url("Podaj poprawny adres URL repozytorium GitHub."),
  sourceName: z.string().trim().optional(),
  sourceDescription: z.string().trim().optional(),
  license: z.string().trim().optional(),
  author: z.string().trim().optional(),
  autoSync: z.coerce.boolean().optional(),
});

export const sectionFormSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  categoryId: z.enum(SECTION_LIBRARY_CATEGORIES),
  description: z.string().trim().min(1),
  technology: z.enum(SECTION_TECHNOLOGIES),
  componentCode: z.string().min(1),
  styleCode: z.string().min(1),
  dependencies: z.array(z.string()),
  difficulty: z.enum(SECTION_DIFFICULTIES),
  requiresJavaScript: z.boolean(),
  responsive: z.boolean(),
  animated: z.boolean(),
  sourceType: z.enum(SECTION_SOURCE_TYPES),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  author: z.string().optional(),
  licenseId: z.string().min(1),
  licenseName: z.string().min(1),
  licenseStatus: z.enum(SECTION_LICENSE_STATUS),
  isFree: z.boolean(),
  commercialUse: z.boolean(),
  attributionRequired: z.boolean(),
  status: z.enum(SECTION_STATUS),
  industryTags: z.array(z.string()),
  styleTags: z.array(z.string()),
  isPremium: z.boolean(),
  thumbnailUrl: z.string().min(1),
  previewHtml: z.string().min(1),
  previewDarkHtml: z.string().min(1),
});

export type SectionFormInput = z.infer<typeof sectionFormSchema>;

export function sectionRowToRecord(row: Record<string, unknown>): SectionRecord {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? row.name ?? ""),
    name: String(row.name ?? ""),
    categoryId: String(row.category_id ?? "sekcje-ofertowe") as SectionLibraryCategory,
    categoryName: String(row.category_name ?? row.category ?? ""),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    thumbnailUrl: String(row.thumbnail_url ?? row.thumbnail ?? ""),
    description: String(row.description ?? ""),
    technology: String(row.technology ?? "React + Tailwind") as SectionTechnology,
    componentCode: String(row.component_code ?? ""),
    styleCode: String(row.style_code ?? ""),
    dependencies: Array.isArray(row.dependencies) ? (row.dependencies as string[]) : [],
    difficulty: String(row.difficulty ?? "medium") as SectionDifficulty,
    requiresJavaScript: Boolean(row.requires_javascript ?? row.requiresJavaScript),
    responsive: row.responsive !== false,
    animated: Boolean(row.animated),
    sourceType: String(row.source_type ?? "own") as SectionSourceType,
    sourceUrl: (row.source_url as string | null) ?? null,
    author: (row.author as string | null) ?? null,
    licenseId: String(row.license_id ?? "proprietary"),
    licenseName: String(row.license_name ?? "Proprietary"),
    licenseStatus: String(row.license_status ?? "known") as SectionLicenseStatus,
    isFree: Boolean(row.is_free ?? true),
    commercialUse: Boolean(row.commercial_use ?? true),
    attributionRequired: Boolean(row.attribution_required ?? false),
    dateAdded: String(row.date_added ?? row.created_at ?? new Date().toISOString()),
    status: String(row.status ?? "active") as SectionStatus,
    industryTags: Array.isArray(row.industry_tags) ? (row.industry_tags as string[]) : [],
    styleTags: Array.isArray(row.style_tags) ? (row.style_tags as string[]) : [],
    isFavorite: Boolean(row.is_favorite),
    isPremium: Boolean(row.is_premium),
    previewHtml: String(row.preview_html ?? ""),
    previewDarkHtml: String(row.preview_dark_html ?? row.preview_html ?? ""),
    aiAnalysis: (row.ai_analysis as SectionAnalysis | null) ?? null,
    variants: Array.isArray(row.variants) ? (row.variants as SectionVariant[]) : undefined,
  };
}

export function sectionRecordToDbPayload(record: SectionRecord): Record<string, unknown> {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    category_id: record.categoryId,
    category_name: record.categoryName,
    tags: record.tags as unknown as Json,
    thumbnail_url: record.thumbnailUrl,
    description: record.description,
    technology: record.technology,
    component_code: record.componentCode,
    style_code: record.styleCode,
    dependencies: record.dependencies as unknown as Json,
    difficulty: record.difficulty,
    requires_javascript: record.requiresJavaScript,
    responsive: record.responsive,
    animated: record.animated,
    source_type: record.sourceType,
    source_url: record.sourceUrl,
    author: record.author,
    license_id: record.licenseId,
    license_name: record.licenseName,
    license_status: record.licenseStatus,
    is_free: record.isFree,
    commercial_use: record.commercialUse,
    attribution_required: record.attributionRequired,
    date_added: record.dateAdded,
    status: record.status,
    industry_tags: record.industryTags as unknown as Json,
    style_tags: record.styleTags as unknown as Json,
    is_favorite: record.isFavorite,
    is_premium: record.isPremium,
    preview_html: record.previewHtml,
    preview_dark_html: record.previewDarkHtml,
    ai_analysis: record.aiAnalysis as unknown as Json,
    variants: record.variants as unknown as Json,
  };
}
