import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "valid-token" }),
    set: vi.fn(),
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/algolia-sync", () => ({
  updateProductInAlgolia: vi.fn().mockResolvedValue(undefined),
  deleteProductFromAlgolia: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/emails", () => ({
  sendPaymentConfirmed: vi.fn().mockResolvedValue(undefined),
  sendShippedConfirmation: vi.fn().mockResolvedValue(undefined),
  sendOrderCancelled: vi.fn().mockResolvedValue(undefined),
}));

const mockPrisma = {
  product: {
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  category: {
    count: vi.fn().mockResolvedValue(0),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  order: {
    findUnique: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
  },
  orderItem: {
    count: vi.fn().mockResolvedValue(0),
  },
  review: {
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    findUnique: vi.fn().mockResolvedValue(null),
    aggregate: vi.fn().mockResolvedValue({ _avg: { rating: 4.5 }, _count: { rating: 10 } }),
  },
  productSpec: {
    deleteMany: vi.fn().mockResolvedValue({}),
  },
  productImage: {
    deleteMany: vi.fn().mockResolvedValue({}),
  },
  $transaction: vi.fn(async (arg: unknown[] | ((tx: typeof mockPrisma) => Promise<unknown>)) => {
    if (typeof arg === "function") {
      return await arg(mockPrisma);
    }
    const results = [];
    for (const item of arg) {
      results.push(await item);
    }
    return results;
  }),
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: "1", email: "admin@test.de", role: "ADMIN" }),
  requireRole: vi.fn().mockResolvedValue({ id: "1", email: "admin@test.de", role: "ADMIN" }),
}));

vi.mock("@/lib/api-helpers", () => ({
  handleApiError: vi.fn().mockReturnValue(
    new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  ),
  validateCsrfOrigin: vi.fn().mockReturnValue(true),
  validateContentType: vi.fn().mockReturnValue(null),
}));

import { NextRequest } from "next/server";

type NextReqInit = ConstructorParameters<typeof NextRequest>[1];

function makeRequest(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
  return new NextRequest(url, init as unknown as NextReqInit);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.$transaction.mockImplementation(async (arg: unknown[] | ((tx: typeof mockPrisma) => Promise<unknown>)) => {
    if (typeof arg === "function") {
      return await arg(mockPrisma);
    }
    const results = [];
    for (const item of arg) {
      results.push(await item);
    }
    return results;
  });
});

describe("PUT /api/admin/produkte/[id]", () => {
  it("updates product with valid data", async () => {
    mockPrisma.product.findFirst.mockResolvedValue(null);
    mockPrisma.product.update.mockResolvedValue({ id: "prod-1" });

    const { PUT } = await import("@/app/api/admin/produkte/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Updated Product",
        slug: "updated-product",
        description: "Updated desc",
        price: 149.99,
        categoryId: "cat-1",
        isNew: false,
        isFeatured: false,
        features: [],
        specs: [],
      }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "prod-1" }) });
    expect(res.status).toBe(200);
  });

  it("rejects duplicate slug", async () => {
    mockPrisma.product.findFirst.mockResolvedValue({ id: "other" });

    const { PUT } = await import("@/app/api/admin/produkte/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test",
        slug: "existing-slug",
        description: "Desc",
        price: 99,
        categoryId: "cat-1",
        isNew: false,
        isFeatured: false,
        features: [],
        specs: [],
      }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "prod-1" }) });
    expect(res.status).toBe(409);
  });

  it("rejects invalid body", async () => {
    const { PUT } = await import("@/app/api/admin/produkte/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte/prod-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "prod-1" }) });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/produkte/[id]", () => {
  it("deletes product", async () => {
    mockPrisma.orderItem.count.mockResolvedValue(0);
    mockPrisma.product.delete.mockResolvedValue({});

    const { DELETE } = await import("@/app/api/admin/produkte/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte/prod-1", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "prod-1" }) });
    expect(res.status).toBe(200);
  });

  it("rejects delete when product has order items", async () => {
    mockPrisma.orderItem.count.mockResolvedValue(3);

    const { DELETE } = await import("@/app/api/admin/produkte/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte/prod-1", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "prod-1" }) });
    expect(res.status).toBe(409);
  });
});

describe("PUT /api/admin/kategorien/[id]", () => {
  it("updates category", async () => {
    mockPrisma.category.update.mockResolvedValue({ id: "cat-1" });

    const { PUT } = await import("@/app/api/admin/kategorien/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien/cat-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Neue Kategorie", slug: "neue-kategorie" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cat-1" }) });
    expect(res.status).toBe(200);
  });

  it("rejects invalid slug", async () => {
    const { PUT } = await import("@/app/api/admin/kategorien/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien/cat-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", slug: "INVALID SLUG!" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "cat-1" }) });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/kategorien/[id]", () => {
  it("deletes category", async () => {
    mockPrisma.category.delete.mockResolvedValue({});

    const { DELETE } = await import("@/app/api/admin/kategorien/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien/cat-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, { params: Promise.resolve({ id: "cat-1" }) });
    expect(res.status).toBe(200);
  });
});

describe("PUT /api/admin/bewertungen/[id]", () => {
  it("approves review and recalculates rating", async () => {
    mockPrisma.review.findUnique.mockResolvedValue({ id: "rev-1", productId: "prod-1" });
    mockPrisma.review.update.mockResolvedValue({ id: "rev-1", productId: "prod-1" });
    mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.0 }, _count: { rating: 5 } });
    mockPrisma.product.update.mockResolvedValue({});

    const { PUT } = await import("@/app/api/admin/bewertungen/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/bewertungen/rev-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "rev-1" }) });
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/admin/bewertungen/[id]", () => {
  it("deletes review and recalculates rating", async () => {
    mockPrisma.review.findUnique.mockResolvedValue({ productId: "prod-1" });
    mockPrisma.review.delete.mockResolvedValue({});
    mockPrisma.review.aggregate.mockResolvedValue({ _avg: { rating: 3.5 }, _count: { rating: 4 } });
    mockPrisma.product.update.mockResolvedValue({});

    const { DELETE } = await import("@/app/api/admin/bewertungen/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/bewertungen/rev-1", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "rev-1" }) });
    expect(res.status).toBe(200);
  });
});

describe("PUT /api/admin/bestellungen/[id]", () => {
  it("updates order status", async () => {
    mockPrisma.order.findUnique.mockResolvedValue({ status: "PROCESSING" });
    mockPrisma.order.update.mockResolvedValue({
      id: "ord-1",
      orderNumber: "HL-240101-001",
      customerFirstName: "Max",
      customerLastName: "Mustermann",
      customerEmail: "max@test.de",
      status: "SHIPPED",
      items: [],
      total: 100,
      shippingCost: 0,
    });

    const { PUT } = await import("@/app/api/admin/bestellungen/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/bestellungen/ord-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SHIPPED" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "ord-1" }) });
    expect(res.status).toBe(200);
  });

  it("rejects invalid status", async () => {
    const { PUT } = await import("@/app/api/admin/bestellungen/[id]/route");
    const req = makeRequest("http://localhost:3000/api/admin/bestellungen/ord-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "INVALID_STATUS" }),
    });

    const res = await PUT(req, { params: Promise.resolve({ id: "ord-1" }) });
    expect(res.status).toBe(400);
  });
});
