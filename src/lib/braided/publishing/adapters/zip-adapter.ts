import { PlannedPublicationAdapter } from "@/lib/publishing/adapters/base-adapter";

export class ZipPublicationAdapter extends PlannedPublicationAdapter {
  readonly target = "zip" as const;
  readonly capability = {
    target: this.target,
    label: "Eksport ZIP",
    supportsPreview: false,
    supportsCustomDomain: false,
    producesArtifact: true,
    requiredEnvironmentVariables: [],
  };
}

