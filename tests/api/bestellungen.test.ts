import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  coupon: { findUnique: vi.fn() },
  product: { findMany: vi.fn() },
  order: { findFirst: vi.fn(), findUnique: vi.fn() },
  orderItem: { count: vi.fn().mockResolvedValue(0) },
  $transaction: vi.fn(async (fn: Function) => {
    const tx = {
      $queryRaw: vi.fn().mockResolvedValue([{ maxUses: 0, usedCount: 0 }]),
      coupon: { update: vi.fn().mockResolvedValue({}) },
      order: {
        create: vi.fn().mockResolvedValue({
          id: "ord-1",
          orderNumber: "HL-202609-ABCDEF12",
          total: 54.99,
          shippingCost: 0,
          status: "PENDING",
          items: [],
        }),
      },
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
  handleApiError: vi.fn().mockImplementation((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("nicht verfügbar") || message.includes("maximal oft") ? 400 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }),
  validateCsrfOrigin: vi.fn().mockReturnValue(true),
  validateContentType: vi.fn().mockReturnValue(null),
}));

vi.mock("@/lib/emails", () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/auth", () => ({
  getCustomerFromRequest: vi.fn().mockResolvedValue(null),
  requireAdmin: vi.fn().mockResolvedValue({ id: "1", email: "admin@test.de", role: "ADMIN" }),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock("@/lib/utils", () => ({
  generateOrderNumber: vi.fn().mockReturnValue("HL-202609-ABCDEF12"),
}));

vi.mock("@/lib/constants", () => ({
  getShippingCost: vi.fn((total: number) => (total >= 50 ? 0 : 4.99)),
  FREE_SHIPPING_THRESHOLD: 50,
  SHIPPING_COST: 4.99,
}));

function makePostRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/bestellungen", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makeGetRequest(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost:3000/api/bestellungen?${qs}`);
}

function makeDetailGetRequest(id: string) {
  return new NextRequest(`http://localhost:3000/api/bestellungen/${id}`);
}

const validOrder = {
  email: "test@test.de",
  firstName: "Max",
  lastName: "Mustermann",
  address: "Musterstraße 1",
  zip: "10115",
  city: "Berlin",
  country: "DE",
  items: [{ id: "prod-1", quantity: 1 }],
};

describe("POST /api/bestellungen", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects missing required fields", async () => {
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest({}));
    expect(res.status).toBe(400);
  });

  it("rejects empty items", async () => {
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest({ ...validOrder, items: [] }));
    expect(res.status).toBe(400);
  });

  it("rejects invalid email", async () => {
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest({ ...validOrder, email: "not-email" }));
    expect(res.status).toBe(400);
  });

  it("rejects invalid PLZ", async () => {
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest({ ...validOrder, zip: "12" }));
    expect(res.status).toBe(400);
  });

  it("creates an order successfully", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    mockPrisma.product.findMany.mockResolvedValue([
      { id: "prod-1", price: 49.99, name: "Test Product" },
    ]);
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest(validOrder));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.order.orderNumber).toBeDefined();
  });

  it("applies coupon discount", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue({
      id: "c1", code: "SAVE10", isActive: true, discountPercent: 10,
      expiresAt: null, maxUses: 0, usedCount: 0,
    });
    mockPrisma.product.findMany.mockResolvedValue([
      { id: "prod-1", price: 100, name: "Expensive Product" },
    ]);
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest({ ...validOrder, couponCode: "SAVE10" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 for non-existent product", async () => {
    mockPrisma.coupon.findUnique.mockResolvedValue(null);
    mockPrisma.product.findMany.mockResolvedValue([]);
    const { POST } = await import("@/app/api/bestellungen/route");
    const res = await POST(makePostRequest(validOrder));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/bestellungen (lookup)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when orderNumber is missing", async () => {
    const { GET } = await import("@/app/api/bestellungen/route");
    const res = await GET(makeGetRequest({ email: "test@test.de" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is missing", async () => {
    const { GET } = await import("@/app/api/bestellungen/route");
    const res = await GET(makeGetRequest({ orderNumber: "HL-202609-ABCDEF12" }));
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent order", async () => {
    mockPrisma.order.findFirst.mockResolvedValue(null);
    const { GET } = await import("@/app/api/bestellungen/route");
    const res = await GET(makeGetRequest({ orderNumber: "HL-202609-ABCDEF12", email: "test@test.de" }));
    expect(res.status).toBe(404);
  });

  it("returns order when found", async () => {
    mockPrisma.order.findFirst.mockResolvedValue({
      id: "ord-1",
      orderNumber: "HL-202609-ABCDEF12",
      total: 54.99,
      shippingCost: 0,
      status: "PENDING",
      items: [{ product: { name: "Test" }, quantity: 1, price: 49.99 }],
    });
    const { GET } = await import("@/app/api/bestellungen/route");
    const res = await GET(makeGetRequest({ orderNumber: "HL-202609-ABCDEF12", email: "test@test.de" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.order.orderNumber).toBe("HL-202609-ABCDEF12");
  });
});

describe("GET /api/bestellungen/[id] (admin detail)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns order detail for admin", async () => {
    mockPrisma.order.findUnique.mockResolvedValue({
      id: "ord-1",
      orderNumber: "HL-202609-ABCDEF12",
      total: 54.99,
      shippingCost: 0,
      status: "PENDING",
      items: [{ product: { name: "Test" }, quantity: 1, price: 49.99 }],
    });
    const { GET } = await import("@/app/api/bestellungen/[id]/route");
    const res = await GET(makeDetailGetRequest("ord-1"), { params: Promise.resolve({ id: "ord-1" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.order.id).toBe("ord-1");
  });

  it("returns 404 for non-existent order", async () => {
    mockPrisma.order.findUnique.mockResolvedValue(null);
    const { GET } = await import("@/app/api/bestellungen/[id]/route");
    const res = await GET(makeDetailGetRequest("nonexistent"), { params: Promise.resolve({ id: "nonexistent" }) });
    expect(res.status).toBe(404);
  });
});
