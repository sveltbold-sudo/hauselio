import { describe, it, expect, vi } from "vitest";
import { Prisma } from "@prisma/client";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  }),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

const { handleApiError } = await import("@/lib/api-helpers");
const { UnauthorizedError, NotFoundError, ValidationError } = await import("@/lib/errors");

describe("handleApiError", () => {
  it("returns 401 for UnauthorizedError", () => {
    const res = handleApiError(new UnauthorizedError());
    expect(res.status).toBe(401);
  });

  it("returns 401 with custom message for UnauthorizedError", () => {
    const res = handleApiError(new UnauthorizedError("Custom auth error"));
    expect(res.status).toBe(401);
  });

  it("returns 404 for NotFoundError", () => {
    const res = handleApiError(new NotFoundError());
    expect(res.status).toBe(404);
  });

  it("returns 404 with custom message for NotFoundError", () => {
    const res = handleApiError(new NotFoundError("Not found here"));
    expect(res.status).toBe(404);
  });

  it("returns 400 for ValidationError", () => {
    const res = handleApiError(new ValidationError("Invalid data"));
    expect(res.status).toBe(400);
  });

  it("returns 404 for Prisma P2025 (record not found)", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Record not found",
      { code: "P2025", clientVersion: "6.0.0" }
    );
    const res = handleApiError(error);
    expect(res.status).toBe(404);
  });

  it("returns 409 for Prisma P2002 (unique constraint)", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint",
      { code: "P2002", clientVersion: "6.0.0" }
    );
    const res = handleApiError(error);
    expect(res.status).toBe(409);
  });

  it("returns 400 for Prisma P2003 (foreign key)", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Foreign key constraint",
      { code: "P2003", clientVersion: "6.0.0" }
    );
    const res = handleApiError(error);
    expect(res.status).toBe(400);
  });

  it("returns 400 for Prisma P2014 (required relation)", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Required relation violation",
      { code: "P2014", clientVersion: "6.0.0" }
    );
    const res = handleApiError(error);
    expect(res.status).toBe(400);
  });

  it("returns 500 for unknown Prisma error code", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unknown error",
      { code: "P9999", clientVersion: "6.0.0" }
    );
    const res = handleApiError(error);
    expect(res.status).toBe(500);
  });

  it("returns 400 for PrismaClientValidationError", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Validation failed",
      { code: "P9999", clientVersion: "6.0.0" }
    );
    Object.setPrototypeOf(error, Prisma.PrismaClientValidationError.prototype);
    const res = handleApiError(error);
    expect(res.status).toBe(400);
  });

  it("returns 500 for PrismaClientUnknownRequestError", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unknown request error",
      { code: "P9999", clientVersion: "6.0.0" }
    );
    Object.setPrototypeOf(error, Prisma.PrismaClientUnknownRequestError.prototype);
    const res = handleApiError(error);
    expect(res.status).toBe(500);
  });

  it("returns 500 for generic unknown errors", () => {
    const res = handleApiError(new Error("Something unexpected"));
    expect(res.status).toBe(500);
  });

  it("returns 500 for null errors", () => {
    const res = handleApiError(null);
    expect(res.status).toBe(500);
  });

  it("returns 500 for string errors", () => {
    const res = handleApiError("string error");
    expect(res.status).toBe(500);
  });
});
