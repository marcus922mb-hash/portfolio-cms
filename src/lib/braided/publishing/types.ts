import type { DemoContent, DemoImage } from "@/features/demos/types";

export type PublicationTarget = "vercel" | "cloudflare" | "wordpress" | "zip";
export type PublicationStatus = "queued" | "building" | "published" | "failed";

export type WebsiteProjectAsset = DemoImage & {
  key: string;
  purpose: "hero" | "about" | "gallery" | "seo";
};

export type WebsiteProject = {
  schemaVersion: 1;
  id: string;
  slug: string;
  name: string;
  content: DemoContent;
  assets: WebsiteProjectAsset[];
  createdAt: string;
};

export type PublicationDestination = {
  projectId?: string;
  siteId?: string;
  endpoint?: string;
  metadata?: Record<string, string>;
};

export type PublicationRequest = {
  project: WebsiteProject;
  destination?: PublicationDestination;
};

export type PublicationResult = {
  target: PublicationTarget;
  status: PublicationStatus;
  deploymentId?: string;
  url?: string;
  artifactUrl?: string;
  createdAt: string;
};

export type PublicationCapability = {
  target: PublicationTarget;
  label: string;
  supportsPreview: boolean;
  supportsCustomDomain: boolean;
  producesArtifact: boolean;
  requiredEnvironmentVariables: string[];
};

export type PublicationValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type PublicationAdapter = {
  readonly target: PublicationTarget;
  readonly capability: PublicationCapability;
  isConfigured(): boolean;
  validate(request: PublicationRequest): Promise<PublicationValidation>;
  publish(request: PublicationRequest): Promise<PublicationResult>;
};

