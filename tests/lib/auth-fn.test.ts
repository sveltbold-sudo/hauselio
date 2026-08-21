import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "@/lib/auth";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-unit-tests-32chars!!";
});

describe("hashPassword", () => {
  it("hashes a password", async () => {
    const hashed = await hashPassword("admin123");
    expect(hashed).not.toBe("admin123");
    expect(hashed).toMatch(/^\$2[aby]?\$/);
  });

  it("generates different hashes for same input", async () => {
    const hash1 = await hashPassword("password");
    const hash2 = await hashPassword("password");
    expect(hash1).not.toBe(hash2);
  }, 10000);
});

describe("verifyPassword", () => {
  it("verifies correct password", async () => {
    const hashed = await hashPassword("test123");
    const result = await verifyPassword("test123", hashed);
    expect(result).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hashed = await hashPassword("test123");
    const result = await verifyPassword("wrong", hashed);
    expect(result).toBe(false);
  });
});

describe("generateToken / verifyToken", () => {
  const payload = { id: "user-1", email: "test@test.de", role: "ADMIN" as const };

  it("generates and verifies a valid token", async () => {
    const token = await generateToken(payload);
    const decoded = await verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe("user-1");
    expect(decoded?.email).toBe("test@test.de");
    expect(decoded?.role).toBe("ADMIN");
  });

  it("returns null for invalid token", async () => {
    const result = await verifyToken("invalid.token.here");
    expect(result).toBeNull();
  });

  it("returns null for empty string", async () => {
    const result = await verifyToken("");
    expect(result).toBeNull();
  });
});
