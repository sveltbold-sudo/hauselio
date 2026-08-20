import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  product: {
    findMany: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

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
  return new NextRequest("http://localhost:3000/api/cart/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/cart/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects empty items array", async () => {
    const { POST } = await import("@/app/api/cart/validate/route");
    const res = await POST(makeRequest({ items: [] }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("validates items against database", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "prod-1",
        name: "Test Product",
        slug: "test-product",
        price: 29.99,
        originalPrice: null,
        inStock: true,
        images: [{ url: "/images/test.jpg" }],
      },
    ]);

    const { POST } = await import("@/app/api/cart/validate/route");
    const res = await POST(makeRequest({ items: [{ id: "prod-1", quantity: 1, price: 29.99 }] }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isValid).toBe(true);
    expect(data.items[0].valid).toBe(true);
    expect(data.items[0].name).toBe("Test Product");
  });

  it("detects missing product", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    const { POST } = await import("@/app/api/cart/validate/route");
    const res = await POST(makeRequest({ items: [{ id: "missing", quantity: 1, price: 10 }] }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isValid).toBe(false);
    expect(data.invalidCount).toBe(1);
    expect(data.items[0].error).toContain("nicht gefunden");
  });

  it("detects price changes", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "prod-1",
        name: "Product",
        slug: "product",
        price: 39.99,
        originalPrice: null,
        inStock: true,
        images: [],
      },
    ]);

    const { POST } = await import("@/app/api/cart/validate/route");
    const res = await POST(makeRequest({ items: [{ id: "prod-1", quantity: 1, price: 29.99 }] }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.priceChangeCount).toBe(1);
    expect(data.items[0].priceChanged).toBe(true);
    expect(data.items[0].newPrice).toBe(39.99);
  });

  it("detects out of stock product", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "prod-1",
        name: "Sold Out",
        slug: "sold-out",
        price: 19.99,
        originalPrice: null,
        inStock: false,
        images: [],
      },
    ]);

    const { POST } = await import("@/app/api/cart/validate/route");
    const res = await POST(makeRequest({ items: [{ id: "prod-1", quantity: 1, price: 19.99 }] }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.isValid).toBe(false);
    expect(data.items[0].error).toContain("nicht verfügbar");
  });

  it("rejects items exceeding max quantity", async () => {
    const { POST } = await import("@/app/api/cart/validate/route");
    const res = await POST(makeRequest({ items: [{ id: "prod-1", quantity: 100, price: 10 }] }));
    expect(res.status).toBe(400);
  });
});
