export class WooCommerceConfigError extends Error {
  constructor(message = "WooCommerce nie jest skonfigurowane poprawnie.") {
    super(message);
    this.name = "WooCommerceConfigError";
  }
}

export class WooCommerceApiError extends Error {
  constructor(message = "WooCommerce API zwróciło błąd.") {
    super(message);
    this.name = "WooCommerceApiError";
  }
}

export class WooCommerceEncryptionError extends Error {
  constructor(message = "Brakuje APP_ENCRYPTION_KEY lub nie udało się odszyfrować danych WooCommerce.") {
    super(message);
    this.name = "WooCommerceEncryptionError";
  }
}
