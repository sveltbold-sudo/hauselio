import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  }),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getRemainingAttempts: vi.fn().mockResolvedValue({ remaining: 5, retryAfterMs: 0 }),
}));

vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ id: "test-email-id" }),
    },
  },
}));

vi.mock("@/lib/emails", () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue(undefined),
  sendContactForward: vi.fn().mockResolvedValue(undefined),
  sendContactAutoReply: vi.fn().mockResolvedValue(undefined),
}));

const mockPrisma = {
  product: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  category: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  brand: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  order: {
    findMany: vi.fn().mockResolvedValue([]),
    findFirst: vi.fn().mockResolvedValue(null),
    findUnique: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    aggregate: vi.fn().mockResolvedValue({ _sum: { total: 0 }, _count: 0 }),
  },
  review: {
    findMany: vi.fn().mockResolvedValue([]),
    findFirst: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    aggregate: vi.fn().mockResolvedValue({ _avg: { rating: 0 }, _count: { rating: 0 } }),
  },
  newsletter: {
    findMany: vi.fn().mockResolvedValue([]),
    findFirst: vi.fn().mockResolvedValue(null),
    findUnique: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  adminUser: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
  },
  siteSettings: {
    findMany: vi.fn().mockResolvedValue([]),
    findFirst: vi.fn().mockResolvedValue(null),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    upsert: vi.fn().mockResolvedValue({}),
  },
  $transaction: vi.fn((fns: unknown[]) => {
    if (Array.isArray(fns)) {
      return Promise.all(fns);
    }
    return fns;
  }),
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

function makeRequest(url: string, init?: RequestInit) {
  const method = init?.method || "GET";
  const headers = new Headers(init?.headers as HeadersInit);
  if (method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH") {
    if (!headers.has("origin")) headers.set("origin", "http://localhost:3000");
    if (!headers.has("host")) headers.set("host", "localhost:3000");
    if (!headers.has("x-forwarded-proto")) headers.set("x-forwarded-proto", "http");
  }
  if (!headers.has("x-forwarded-for")) headers.set("x-forwarded-for", "127.0.0.1");
  if (!headers.has("host")) headers.set("host", "localhost:3000");
  return new NextRequest(url, {
    ...init,
    headers,
  } as import("next/dist/server/web/spec-extension/request").RequestInit);
}

describe("GET /api/products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns products with default pagination", async () => {
    const mockProducts = [
      {
        id: "1", name: "Test Product", slug: "test-product", price: 99.99,
        originalPrice: null, rating: 0, reviewCount: 0, isNew: false,
        isPromo: false, inStock: true, brand: null,
        category: { name: "Test", slug: "test" },
        images: [{ url: "https://example.com/img.jpg" }],
      },
    ];
    mockPrisma.product.findMany.mockResolvedValue(mockProducts as never[]);
    mockPrisma.product.count.mockResolvedValue(1);

    const { GET } = await import("@/app/api/products/route");
    const req = makeRequest("http://localhost:3000/api/products");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.products).toBeDefined();
    expect(Array.isArray(data.products)).toBe(true);
  });

  it("handles invalid page parameter gracefully", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.product.count.mockResolvedValue(0);

    const { GET } = await import("@/app/api/products/route");
    const req = makeRequest("http://localhost:3000/api/products?page=abc");
    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("applies category filter", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.product.count.mockResolvedValue(0);

    const { GET } = await import("@/app/api/products/route");
    const req = makeRequest("http://localhost:3000/api/products?category=kueche");
    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("applies search filter", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.product.count.mockResolvedValue(0);

    const { GET } = await import("@/app/api/products/route");
    const req = makeRequest("http://localhost:3000/api/products?search=thermomix");
    const res = await GET(req);

    expect(res.status).toBe(200);
  });

  it("applies sorting", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.product.count.mockResolvedValue(0);

    const { GET } = await import("@/app/api/products/route");
    const req = makeRequest("http://localhost:3000/api/products?sort=price_asc");
    const res = await GET(req);

    expect(res.status).toBe(200);
  });
});

describe("GET /api/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns categories with product counts", async () => {
    const mockCategories = [
      { id: "1", name: "Küche", slug: "kueche", description: null, image: null, _count: { products: 5 } },
    ];
    mockPrisma.category.findMany.mockResolvedValue(mockCategories as never[]);

    const { GET } = await import("@/app/api/categories/route");
    const req = new NextRequest("http://localhost:3000/api/categories");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.categories).toBeDefined();
    expect(Array.isArray(data.categories)).toBe(true);
  });
});

describe("GET /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires productId query param", async () => {
    const { GET } = await import("@/app/api/reviews/route");
    const req = makeRequest("http://localhost:3000/api/reviews");
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it("returns reviews for valid productId", async () => {
    mockPrisma.review.findMany.mockResolvedValue([]);

    const { GET } = await import("@/app/api/reviews/route");
    const req = makeRequest("http://localhost:3000/api/reviews?productId=prod-1");
    const res = await GET(req);

    expect(res.status).toBe(200);
  });
});

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes a valid email", async () => {
    mockPrisma.newsletter.findUnique.mockResolvedValue(null);
    mockPrisma.newsletter.create.mockResolvedValue({} as never);

    const { POST } = await import("@/app/api/newsletter/route");
    const req = makeRequest("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });

  it("rejects invalid email", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    const req = makeRequest("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("rejects empty body", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    const req = makeRequest("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid contact form", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const req = makeRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "", email: "invalid" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("accepts valid contact form", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const req = makeRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Max",
        lastName: "Mustermann",
        email: "max@example.com",
        subject: "Test",
        message: "Hallo",
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });
});

describe("POST /api/cart/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects empty cart", async () => {
    const { POST } = await import("@/app/api/cart/validate/route");
    const req = makeRequest("http://localhost:3000/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("rejects cart exceeding max items", async () => {
    const items = Array.from({ length: 51 }, (_, i) => ({
      id: `item-${i}`,
      quantity: 1,
    }));

    const { POST } = await import("@/app/api/cart/validate/route");
    const req = makeRequest("http://localhost:3000/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("50");
  });

  it("validates items against database", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    const { POST } = await import("@/app/api/cart/validate/route");
    const req = makeRequest("http://localhost:3000/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "nonexistent", quantity: 1, price: 99.99 }],
      }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.isValid).toBe(false);
    expect(data.invalidCount).toBe(1);
  });
});

describe("POST /api/bestellungen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects order with missing fields", async () => {
    const { POST } = await import("@/app/api/bestellungen/route");
    const req = makeRequest("http://localhost:3000/api/bestellungen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("rejects order with empty items", async () => {
    const { POST } = await import("@/app/api/bestellungen/route");
    const req = makeRequest("http://localhost:3000/api/bestellungen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        firstName: "Max",
        lastName: "Mustermann",
        address: "Musterstraße 1",
        city: "Berlin",
        zip: "10115",
        country: "DE",
        items: [],
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});

describe("GET /api/bestellungen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires orderNumber and email", async () => {
    const { GET } = await import("@/app/api/bestellungen/route");
    const req = makeRequest("http://localhost:3000/api/bestellungen");
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent order", async () => {
    mockPrisma.order.findFirst.mockResolvedValue(null);

    const { GET } = await import("@/app/api/bestellungen/route");
    const req = makeRequest("http://localhost:3000/api/bestellungen?orderNumber=HL-000001&email=test@example.com");
    const res = await GET(req);

    expect(res.status).toBe(404);
  });
});

describe("GET /api/bank", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns bank details", async () => {
    mockPrisma.siteSettings.findFirst.mockResolvedValue({
      bankIban: "DE89370400440532013000",
      bankBic: "COBADEFFXXX",
      bankAccountName: "HAUSELIO GmbH",
      bankName: "Test Bank",
    } as never);

    const { GET } = await import("@/app/api/bank/route");
    const req = makeRequest("http://localhost:3000/api/bank");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.bank).toBeDefined();
  });
});

describe("GET /api/einstellungen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 without admin authentication", async () => {
    const { GET } = await import("@/app/api/einstellungen/route");
    const req = new NextRequest("http://localhost:3000/api/einstellungen");
    const res = await GET(req);

    expect(res.status).toBe(401);
  });
});

describe("GET /api/newsletter/unsubscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires token query param", async () => {
    const { GET } = await import("@/app/api/newsletter/unsubscribe/route");
    const req = makeRequest("http://localhost:3000/api/newsletter/unsubscribe");
    const res = await GET(req);
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain("Ungültiger Link");
  });
});
