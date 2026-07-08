import {
  PublicationNotConfiguredError,
  PublicationNotImplementedError,
} from "@/lib/publishing/errors";
import type {
  PublicationAdapter,
  PublicationCapability,
  PublicationRequest,
  PublicationResult,
  PublicationTarget,
  PublicationValidation,
} from "@/lib/publishing/types";

export abstract class PlannedPublicationAdapter implements PublicationAdapter {
  abstract readonly target: PublicationTarget;
  abstract readonly capability: PublicationCapability;

  isConfigured() {
    return this.capability.requiredEnvironmentVariables.every(
      (variable) => Boolean(process.env[variable])
    );
  }

  async validate(request: PublicationRequest): Promise<PublicationValidation> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!request.project.id) errors.push("Projekt nie ma identyfikatora.");
    if (!request.project.slug) errors.push("Projekt nie ma sluga.");
    if (!request.project.content.structure.length) {
      errors.push("Projekt nie zawiera struktury strony.");
    }
    if (request.project.assets.some((asset) => !asset.url)) {
      warnings.push("Część zdjęć pozostanie placeholderami.");
    }
    if (!this.isConfigured() && this.capability.requiredEnvironmentVariables.length) {
      warnings.push(
        `Brakuje konfiguracji: ${this.capability.requiredEnvironmentVariables.join(", ")}.`
      );
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  async publish(request: PublicationRequest): Promise<PublicationResult> {
    const validation = await this.validate(request);
    if (!validation.valid) {
      throw new Error(`Projekt nie przeszedł walidacji: ${validation.errors.join(" ")}`);
    }
    if (!this.isConfigured()) {
      throw new PublicationNotConfiguredError(
        this.target,
        this.capability.requiredEnvironmentVariables
      );
    }
    throw new PublicationNotImplementedError(this.target);
  }
}

