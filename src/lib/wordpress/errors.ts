export class WPConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WPConnectionError";
  }
}

export class WPAuthError extends Error {
  constructor(message = "Błąd autoryzacji WordPress. Sprawdź login i Application Password.") {
    super(message);
    this.name = "WPAuthError";
  }
}

export class WPNotFoundError extends Error {
  constructor(message = "Zasób WordPress nie został znaleziony.") {
    super(message);
    this.name = "WPNotFoundError";
  }
}
