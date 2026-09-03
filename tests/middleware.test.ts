import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

const mockJwtVerify = vi.fn();
vi.mock("jose", () => ({
  jwtVerify: (...args: unknown[]) => mockJwtVerify(...args),
}));

const mockPrismaAdminFindUnique = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    adminUser: {
      findUnique: (...args: unknown[]) => mockPrismaAdminFindUnique(...args),
    },
  },
}));

vi.mock("@/lib/constants", () => ({
  SITE_URL: "https://localhost:3000",
}));

import { middleware } from "../middleware";

function makeRequest(path: string, opts?: { method?: string; headers?: Record<string, string> }) {
  return new NextRequest(`http://localhost:3000${path}`, {
    method: opts?.method || "GET",
    headers: {
      "x-forwarded-proto": "https",
      "x-forwarded-host": "localhost:3000",
      ...opts?.headers,
    },
  });
}

function makeAdminTokenPayload(id = "admin-1", email = "admin@HAUSAURA.de") {
  return { payload: { id, email, role: "ADMIN", iat: 1, exp: 9999999999 } };
}

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret-for-unit-tests-that-is-long-enough";
    mockJwtVerify.mockResolvedValue(makeAdminTokenPayload());
    mockPrismaAdminFindUnique.mockResolvedValue({ id: "admin-1", role: "ADMIN" });
  });

  it("passes through public routes", async () => {
    const res = await middleware(makeRequest("/shop"));
    expect(res.status).not.toBe(307);
  });

  it("redirects /admin to /admin/login without token", async () => {
    mockJwtVerify.mockRejectedValue(new Error("no token"));
    const res = await middleware(makeRequest("/admin"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  it("allows /admin with valid token cookie", async () => {
    const req = makeRequest("/admin", {
      headers: { cookie: "admin_token=valid.jwt.token" },
    });
    const res = await middleware(req);
    expect(mockJwtVerify).toHaveBeenCalled();
    expect(res.status).not.toBe(307);
  });

  it("returns 403 on admin POST without CSRF origin", async () => {
    const req = makeRequest("/api/admin/produkte", {
      method: "POST",
      headers: {
        cookie: "admin_token=valid.jwt.token",
      },
    });
    const res = await middleware(req);
    expect(res.status).toBe(403);
  });

  it("allows admin POST with valid CSRF origin", async () => {
    const req = makeRequest("/api/admin/produkte", {
      method: "POST",
      headers: {
        cookie: "admin_token=valid.jwt.token",
        origin: "https://localhost:3000",
      },
    });
    const res = await middleware(req);
    expect(res.status).not.toBe(403);
  });

  it("rejects production dev-keyword JWT secrets", async () => {
    process.env.JWT_SECRET = "HAUSAURA-super-secret-key-for-dev";
    mockJwtVerify.mockRejectedValue(new Error("invalid"));
    const res = await middleware(makeRequest("/admin", {
      headers: { cookie: "admin_token=bad.jwt.token" },
    }));
    expect(res.status).toBe(307);
    process.env.JWT_SECRET = "test-secret-for-unit-tests-that-is-long-enough";
  });

  it("rejects low-entropy JWT secrets", async () => {
    process.env.JWT_SECRET = "aaaaaaaaaa";
    mockJwtVerify.mockRejectedValue(new Error("invalid"));
    const res = await middleware(makeRequest("/admin", {
      headers: { cookie: "admin_token=bad.jwt.token" },
    }));
    expect(res.status).toBe(307);
    process.env.JWT_SECRET = "test-secret-for-unit-tests-that-is-long-enough";
  });
});
