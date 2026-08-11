export class UnauthorizedError extends Error {
  constructor(message = "Nicht autorisiert") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Nicht gefunden") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message = "Ungültige Eingabe") {
    super(message);
    this.name = "ValidationError";
  }
}
