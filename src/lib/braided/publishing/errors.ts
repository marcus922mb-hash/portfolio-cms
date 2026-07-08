import type { PublicationTarget } from "@/lib/publishing/types";

export class PublicationError extends Error {
  constructor(
    message: string,
    readonly target: PublicationTarget,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = "PublicationError";
  }
}

export class PublicationNotConfiguredError extends PublicationError {
  constructor(target: PublicationTarget, variables: string[]) {
    super(
      `Adapter ${target} nie jest skonfigurowany. Wymagane: ${variables.join(", ")}.`,
      target
    );
    this.name = "PublicationNotConfiguredError";
  }
}

export class PublicationNotImplementedError extends PublicationError {
  constructor(target: PublicationTarget) {
    super(
      `Adapter ${target} ma gotowy kontrakt, ale wykonanie publikacji nie jest jeszcze zaimplementowane.`,
      target
    );
    this.name = "PublicationNotImplementedError";
  }
}

