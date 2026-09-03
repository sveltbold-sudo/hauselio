import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  product: { findUnique: vi.fn() },
  review: { findFirst: vi.fn(), findMany: vi.fn(), count: vi.fn(), create: vi.fn(), aggregate: vi.fn() },
  productUpdate: vi.fn(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  $transaction: vi.fn(async (fn: Function) => {
    const tx = {
      review: { create: vi.fn().mockResolvedValue({ id: "r1", rating: 5, title: "Great", content: "Good", authorName: "Test", authorEmail: "test@test.de", createdAt: new Date() }) },
      reviewAggregate: vi.fn().mockResolvedValue({ _avg: { rating: 4.5 }, _count: { rating: 10 } }),
      product: { update: vi.fn().mockResolvedValue({}) },
    };
    return fn(tx);
  }),
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

function makePostRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost:3000/api/reviews?${qs}`);
}

const validReview = {
  productId: "prod-1",
  rating: 5,
  title: "Excellent",
  content: "Great product",
  authorName: "Max Mustermann",
  authorEmail: "max@test.de",
};

describe("POST /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects missing required fields", async () => {
    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makePostRequest({}));
    expect(res.status).toBe(400);
  });

  it("rejects invalid rating", async () => {
    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makePostRequest({ ...validReview, rating: 6 }));
    expect(res.status).toBe(400);
  });

  it("rejects invalid email", async () => {
    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makePostRequest({ ...validReview, authorEmail: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent product", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);
    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makePostRequest(validReview));
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toContain("Produkt nicht gefunden");
  });

  it("returns 409 for duplicate review", async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: "prod-1", name: "Test" });
    mockPrisma.review.findFirst.mockResolvedValue({ id: "existing-review" });
    const { POST } = await import("@/app/api/reviews/route");
    const res = await POST(makePostRequest(validReview));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toContain("bereits");
  });
});

describe("GET /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when productId is missing", async () => {
    const { GET } = await import("@/app/api/reviews/route");
    const res = await GET(makeGetRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns reviews for a product", async () => {
    mockPrisma.review.findMany.mockResolvedValue([
      { id: "r1", rating: 5, title: "Great", content: "Good", authorName: "Test", createdAt: new Date() },
    ]);
    mockPrisma.review.count.mockResolvedValue(1);
    const { GET } = await import("@/app/api/reviews/route");
    const res = await GET(makeGetRequest({ productId: "prod-1" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reviews).toHaveLength(1);
    expect(data.total).toBe(1);
    expect(data.page).toBe(1);
  });

  it("returns empty array for product with no reviews", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/reviews/route");
    const res = await GET(makeGetRequest({ productId: "prod-999" }));
    const data = await res.json();
    expect(data.reviews).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  it("handles pagination params", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);
    mockPrisma.review.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/reviews/route");
    const res = await GET(makeGetRequest({ productId: "prod-1", page: "2", limit: "10" }));
    expect(res.status).toBe(200);
  });
});
