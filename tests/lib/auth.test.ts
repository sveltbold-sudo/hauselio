import { describe, it, expect } from "vitest";

describe("Error classes", () => {
  it("UnauthorizedError has correct name and message", async () => {
    const { UnauthorizedError } = await import("@/lib/errors");
    const error = new UnauthorizedError();
    expect(error.message).toBe("Nicht autorisiert");
    expect(error.name).toBe("UnauthorizedError");
    expect(error instanceof Error).toBe(true);
  });

  it("NotFoundError has correct name and message", async () => {
    const { NotFoundError } = await import("@/lib/errors");
    const error = new NotFoundError("Test nicht gefunden");
    expect(error.message).toBe("Test nicht gefunden");
    expect(error.name).toBe("NotFoundError");
  });

  it("ValidationError has correct name and message", async () => {
    const { ValidationError } = await import("@/lib/errors");
    const error = new ValidationError("Invalid input");
    expect(error.message).toBe("Invalid input");
    expect(error.name).toBe("ValidationError");
  });
});

describe("Admin constants", () => {
  it("defines allowed order statuses", async () => {
    const { ALLOWED_ORDER_STATUSES } = await import("@/lib/admin-constants");
    expect(ALLOWED_ORDER_STATUSES).toContain("PENDING_PAYMENT");
    expect(ALLOWED_ORDER_STATUSES).toContain("SHIPPED");
    expect(ALLOWED_ORDER_STATUSES).toContain("DELIVERED");
    expect(ALLOWED_ORDER_STATUSES).toContain("CANCELLED");
  });

  it("defines allowed payment statuses", async () => {
    const { ALLOWED_PAYMENT_STATUSES } = await import("@/lib/admin-constants");
    expect(ALLOWED_PAYMENT_STATUSES).toContain("PENDING");
    expect(ALLOWED_PAYMENT_STATUSES).toContain("CONFIRMED");
  });
});
