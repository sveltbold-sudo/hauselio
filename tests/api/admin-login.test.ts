import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  }),
}));

const mockPrisma = {
  adminUser: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getRemainingAttempts: vi.fn().mockResolvedValue({ remaining: 4, retryAfterMs: 0 }),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

type NextReqInit = ConstructorParameters<typeof NextRequest>[1];

function makeRequest(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
  return new NextRequest(url, {
    ...init,
    headers: {
      ...init?.headers,
      origin: "http://localhost:3000",
      "x-forwarded-proto": "http",
      "x-forwarded-host": "localhost:3000",
    },
  } as unknown as NextReqInit);
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = "test-secret-key-for-unit-tests-32chars!!";
});

describe("POST /api/admin/login", () => {
  it("logs in with valid credentials", { timeout: 15000 }, async () => {
    const { hashPassword } = await import("@/lib/auth");
    const hash = await hashPassword("admin123");

    mockPrisma.adminUser.findUnique
      .mockResolvedValueOnce({ lockedUntil: null }) // lockout check
      .mockResolvedValueOnce({
        id: "admin-1",
        email: "admin@test.de",
        password: hash,
        role: "ADMIN",
        name: "Admin",
      }); // authenticateAdmin
    mockPrisma.adminUser.update.mockResolvedValue({});

    const { POST } = await import("@/app/api/admin/login/route");
    const req = makeRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.de", password: "admin123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("rejects wrong password with 401", async () => {
    const { hashPassword } = await import("@/lib/auth");
    const hash = await hashPassword("correct-password");

    mockPrisma.adminUser.findUnique
      .mockResolvedValueOnce({ lockedUntil: null })
      .mockResolvedValueOnce({
        id: "admin-1",
        email: "admin@test.de",
        password: hash,
        role: "ADMIN",
      });
    mockPrisma.adminUser.update.mockResolvedValue({ failedAttempts: 1 });

    const { POST } = await import("@/app/api/admin/login/route");
    const req = makeRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.de", password: "wrong-password" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  }, 15000);

  it("rejects invalid body with 400", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const req = makeRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects login when account is locked", async () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      lockedUntil: futureDate,
    });

    const { POST } = await import("@/app/api/admin/login/route");
    const req = makeRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.de", password: "any-passw" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("rejects wrong Content-Type", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const req = makeRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "not json",
    });

    const res = await POST(req);
    expect(res.status).toBe(415);
  });

  it("rejects non-existent email with 401", async () => {
    mockPrisma.adminUser.findUnique
      .mockResolvedValueOnce({ lockedUntil: null })
      .mockResolvedValueOnce(null); // authenticateAdmin returns null
    mockPrisma.adminUser.update.mockResolvedValue({});

    const { POST } = await import("@/app/api/admin/login/route");
    const req = makeRequest("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent@test.de", password: "any-passw" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  }, 15000);
});
