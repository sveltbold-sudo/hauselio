import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  review: {
    findMany: vi.fn(),
    count: vi.fn(),
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

function makeGetRequest(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : "";
  const url = qs ? `http://localhost:3000/api/admin/bewertungen?${qs}` : "http://localhost:3000/api/admin/bewertungen";
  return new NextRequest(url);
}

describe("GET /api/admin/bewertungen", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns reviews list with pagination and pending count", async () => {
    mockPrisma.review.findMany.mockResolvedValue([
      { id: "r1", rating: 5, product: { name: "Test", slug: "test" } },
    ]);
    mockPrisma.review.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    const { GET } = await import("@/app/api/admin/bewertungen/route");
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reviews).toHaveLength(1);
    expect(data.pagination).toBeDefined();
    expect(data.pendingCount).toBeDefined();
  });

  it("supports filter=pending", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/bewertungen/route");
    const res = await GET(makeGetRequest({ filter: "pending" }));
    expect(res.status).toBe(200);
  });

  it("supports filter=approved", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/bewertungen/route");
    const res = await GET(makeGetRequest({ filter: "approved" }));
    expect(res.status).toBe(200);
  });

  it("handles pagination params", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/bewertungen/route");
    const res = await GET(makeGetRequest({ page: "2", limit: "10" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(10);
  });

  it("returns empty list when no reviews exist", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/bewertungen/route");
    const res = await GET(makeGetRequest());
    const data = await res.json();
    expect(data.reviews).toHaveLength(0);
    expect(data.pagination.total).toBe(0);
  });
});
