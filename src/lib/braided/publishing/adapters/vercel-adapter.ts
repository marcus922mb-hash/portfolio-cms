import { PlannedPublicationAdapter } from "@/lib/publishing/adapters/base-adapter";

export class VercelPublicationAdapter extends PlannedPublicationAdapter {
  readonly target = "vercel" as const;
  readonly capability = {
    target: this.target,
    label: "Vercel",
    supportsPreview: true,
    supportsCustomDomain: true,
    producesArtifact: false,
    requiredEnvironmentVariables: ["VERCEL_TOKEN"],
  };
}

