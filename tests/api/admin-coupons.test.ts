import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  coupon: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: "1", email: "admin@test.de", role: "ADMIN" }),
}));

vi.mock("@/lib/api-helpers", () => ({
  handleApiError: vi.fn().mockReturnValue(
    new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  ),
  validateCsrfOrigin: vi.fn().mockReturnValue(true),
  validateContentType: vi.fn().mockReturnValue(null),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

function makeGetRequest(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : "";
  const url = qs ? `http://localhost:3000/api/admin/coupons?${qs}` : "http://localhost:3000/api/admin/coupons";
  return new NextRequest(url);
}

function makePostRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/admin/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makePutRequest(id: string, body: unknown) {
  return new NextRequest(`http://localhost:3000/api/admin/coupons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(id: string) {
  return new NextRequest(`http://localhost:3000/api/admin/coupons/${id}`, {
    method: "DELETE",
    headers: { origin: "http://localhost:3000" },
  });
}

const validCoupon = { code: "TEST20", discountPercent: 20, maxUses: 0, isActive: true };

describe("GET /api/admin/coupons", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns coupons list", async () => {
    mockPrisma.coupon.findMany.mockResolvedValue([{ id: "1", code: "TEST" }]);
    mockPrisma.coupon.count.mockResolvedValue(1);
    const { GET } = await import("@/app/api/admin/coupons/route");
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.coupons).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it("supports search filter", async () => {
    mockPrisma.coupon.findMany.mockResolvedValue([]);
    mockPrisma.coupon.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/coupons/route");
    const res = await GET(makeGetRequest({ search: "TEST" }));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/admin/coupons", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    mockPrisma.coupon.create.mockResolvedValue({ id: "1", code: "NEW20", discountPercent: 20 });
    const { POST } = await import("@/app/api/admin/coupons/route");
    const res = await POST(makePostRequest(validCoupon));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.coupon.code).toBe("NEW20");
  });

  it("rejects duplicate code", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({ id: "1", code: "TEST20" });
    const { POST } = await import("@/app/api/admin/coupons/route");
    const res = await POST(makePostRequest(validCoupon));
    expect(res.status).toBe(409);
  });

  it("rejects invalid data", async () => {
    const { POST } = await import("@/app/api/admin/coupons/route");
    const res = await POST(makePostRequest({ code: "", discountPercent: 200 }));
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/admin/coupons/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates a coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValueOnce({ id: "1", code: "OLD" });
    mockPrisma.coupon.findFirst.mockResolvedValue(null);
    mockPrisma.coupon.update.mockResolvedValue({ id: "1", code: "NEW" });
    const { PUT } = await import("@/app/api/admin/coupons/[id]/route");
    const res = await PUT(makePutRequest("1", validCoupon), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });

  it("returns 404 for non-existent coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    const { PUT } = await import("@/app/api/admin/coupons/[id]/route");
    const res = await PUT(makePutRequest("999", validCoupon), { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });

  it("rejects duplicate code on update", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValueOnce({ id: "1", code: "OLD" });
    mockPrisma.coupon.findFirst.mockResolvedValue({ id: "2", code: "TAKEN" });
    const { PUT } = await import("@/app/api/admin/coupons/[id]/route");
    const res = await PUT(makePutRequest("1", { ...validCoupon, code: "TAKEN" }), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(409);
  });
});

describe("DELETE /api/admin/coupons/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({ id: "1", code: "TODELETE" });
    mockPrisma.coupon.delete.mockResolvedValue({});
    const { DELETE } = await import("@/app/api/admin/coupons/[id]/route");
    const res = await DELETE(makeDeleteRequest("1"), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 404 for non-existent coupon", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    const { DELETE } = await import("@/app/api/admin/coupons/[id]/route");
    const res = await DELETE(makeDeleteRequest("999"), { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });
});
