import { PlannedPublicationAdapter } from "@/lib/publishing/adapters/base-adapter";

export class WordPressPublicationAdapter extends PlannedPublicationAdapter {
  readonly target = "wordpress" as const;
  readonly capability = {
    target: this.target,
    label: "WordPress",
    supportsPreview: false,
    supportsCustomDomain: true,
    producesArtifact: false,
    requiredEnvironmentVariables: ["WORDPRESS_ENCRYPTION_KEY"],
  };
}

