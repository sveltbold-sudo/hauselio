import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  coupon: {
    findUnique: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/api-helpers", () => ({
  handleApiError: vi.fn().mockReturnValue(
    new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  ),
  validateCsrfOrigin: vi.fn().mockReturnValue(true),
  validateContentType: vi.fn().mockReturnValue(null),
}));

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/coupon", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/coupon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when code is missing", async () => {
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ cartTotal: 100 }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Gutscheincode");
  });

  it("returns 400 when code is empty string", async () => {
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ code: "", cartTotal: 100 }));
    expect(res.status).toBe(400);
  });

  it("returns 200 with valid:false for unknown coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ code: "NONEXISTENT", cartTotal: 100 }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.valid).toBe(false);
    expect(data.error).toContain("Ungültiger");
  });

  it("returns 200 with valid:false for inactive coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      id: "1", code: "TEST10", isActive: false, discountPercent: 10,
      expiresAt: null, maxUses: 0, usedCount: 0,
    });
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ code: "TEST10", cartTotal: 100 }));
    const data = await res.json();
    expect(data.valid).toBe(false);
    expect(data.error).toContain("nicht mehr aktiv");
  });

  it("returns 200 with valid:false for expired coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      id: "1", code: "EXPIRED", isActive: true, discountPercent: 10,
      expiresAt: new Date("2020-01-01"), maxUses: 0, usedCount: 0,
    });
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ code: "EXPIRED", cartTotal: 100 }));
    const data = await res.json();
    expect(data.valid).toBe(false);
    expect(data.error).toContain("abgelaufen");
  });

  it("returns 200 with valid:false for maxed-out coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      id: "1", code: "LIMITED", isActive: true, discountPercent: 20,
      expiresAt: null, maxUses: 10, usedCount: 10,
    });
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ code: "LIMITED", cartTotal: 100 }));
    const data = await res.json();
    expect(data.valid).toBe(false);
    expect(data.error).toContain("maximal oft");
  });

  it("returns 200 with valid:true for active coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      id: "1", code: "SUMMER15", isActive: true, discountPercent: 15,
      expiresAt: null, maxUses: 0, usedCount: 0,
    });
    const { POST } = await import("@/app/api/coupon/route");
    const res = await POST(makeRequest({ code: "summer15", cartTotal: 100 }));
    const data = await res.json();
    expect(data.valid).toBe(true);
    expect(data.code).toBe("SUMMER15");
    expect(data.discountPercent).toBe(15);
    expect(data.label).toContain("15%");
  });

  it("normalizes code to uppercase", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    const { POST } = await import("@/app/api/coupon/route");
    await POST(makeRequest({ code: "test", cartTotal: 50 }));
    expect(mockPrisma.coupon.findUnique).toHaveBeenCalledWith({
      where: { code: "TEST" },
    });
  });
});
