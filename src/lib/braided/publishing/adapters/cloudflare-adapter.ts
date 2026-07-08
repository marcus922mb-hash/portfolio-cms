import { PlannedPublicationAdapter } from "@/lib/publishing/adapters/base-adapter";

export class CloudflarePublicationAdapter extends PlannedPublicationAdapter {
  readonly target = "cloudflare" as const;
  readonly capability = {
    target: this.target,
    label: "Cloudflare Pages",
    supportsPreview: true,
    supportsCustomDomain: true,
    producesArtifact: false,
    requiredEnvironmentVariables: [
      "CLOUDFLARE_ACCOUNT_ID",
      "CLOUDFLARE_API_TOKEN",
    ],
  };
}

