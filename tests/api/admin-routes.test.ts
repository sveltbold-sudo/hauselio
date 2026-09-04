import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

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

vi.mock("@/lib/api-helpers", () => ({
  handleApiError: vi.fn().mockReturnValue(
    new Response(JSON.stringify({ error: "Internal error" }), { status: 500 })
  ),
  validateCsrfOrigin: vi.fn().mockReturnValue(true),
  validateContentType: vi.fn().mockReturnValue(null),
}));

const mockPrisma = {
  product: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({ id: "prod-1", name: "Test", slug: "test" }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  category: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({ id: "cat-1", name: "Test", slug: "test" }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  brand: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: "brand-1", name: "Test", slug: "test" }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: "1", email: "admin@test.de", role: "ADMIN" }),
  requireRole: vi.fn().mockResolvedValue({ id: "1", email: "admin@test.de", role: "ADMIN" }),
}));

type NextReqInit = ConstructorParameters<typeof NextRequest>[1];

function makeRequest(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
  return new NextRequest(url, init as unknown as NextReqInit);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/admin/produkte", () => {
  it("rejects product with missing fields", async () => {
    const { POST } = await import("@/app/api/admin/produkte/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects product with invalid slug", async () => {
    const { POST } = await import("@/app/api/admin/produkte/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Product",
        slug: "INVALID SLUG WITH SPACES",
        description: "Test",
        price: 99.99,
        categoryId: "cat-1",
        isNew: false,
        isFeatured: false,
        features: [],
        specs: [],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates product with valid data", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);
    mockPrisma.product.create.mockResolvedValue({
      id: "prod-1",
      name: "Test Product",
      slug: "test-product",
    });

    const { POST } = await import("@/app/api/admin/produkte/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Product",
        slug: "test-product",
        description: "A test product",
        price: 99.99,
        categoryId: "cat-1",
        isNew: false,
        isFeatured: false,
        features: [],
        specs: [],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("rejects duplicate slug", async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: "existing" });

    const { POST } = await import("@/app/api/admin/produkte/route");
    const req = makeRequest("http://localhost:3000/api/admin/produkte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Product",
        slug: "existing-slug",
        description: "Test",
        price: 99.99,
        categoryId: "cat-1",
        isNew: false,
        isFeatured: false,
        features: [],
        specs: [],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});

describe("GET /api/admin/kategorien", () => {
  it("returns categories list", async () => {
    mockPrisma.category.findMany.mockResolvedValue([
      { id: "1", name: "Küche", slug: "kueche", _count: { products: 10 } },
    ]);
    mockPrisma.category.count.mockResolvedValue(1);

    const { GET } = await import("@/app/api/admin/kategorien/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.categories).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it("supports pagination", async () => {
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.category.count.mockResolvedValue(50);

    const { GET } = await import("@/app/api/admin/kategorien/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien?page=2&limit=10");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(10);
  });
});

describe("POST /api/admin/kategorien", () => {
  it("rejects category with missing fields", async () => {
    const { POST } = await import("@/app/api/admin/kategorien/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid slug format", async () => {
    const { POST } = await import("@/app/api/admin/kategorien/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", slug: "INVALID SLUG!" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates category with valid data", async () => {
    mockPrisma.category.create.mockResolvedValue({
      id: "cat-1",
      name: "Neue Kategorie",
      slug: "neue-kategorie",
    });

    const { POST } = await import("@/app/api/admin/kategorien/route");
    const req = makeRequest("http://localhost:3000/api/admin/kategorien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Neue Kategorie",
        slug: "neue-kategorie",
        description: "Eine neue Kategorie",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});

describe("GET /api/admin/marken", () => {
  it("returns brands list", async () => {
    mockPrisma.brand.findMany.mockResolvedValue([
      { id: "1", name: "Miele", slug: "miele" },
    ]);

    const { GET } = await import("@/app/api/admin/marken/route");
    const res = await GET(new NextRequest("http://localhost:3000/api/admin/marken"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.brands).toHaveLength(1);
  });
});

describe("POST /api/admin/marken", () => {
  it("rejects brand with missing name", async () => {
    const { POST } = await import("@/app/api/admin/marken/route");
    const req = makeRequest("http://localhost:3000/api/admin/marken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates brand with valid name", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue(null);
    mockPrisma.brand.create.mockResolvedValue({
      id: "brand-1",
      name: "Siemens",
      slug: "siemens",
    });

    const { POST } = await import("@/app/api/admin/marken/route");
    const req = makeRequest("http://localhost:3000/api/admin/marken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Siemens" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("rejects duplicate brand", async () => {
    mockPrisma.brand.findFirst.mockResolvedValue({ id: "existing" });

    const { POST } = await import("@/app/api/admin/marken/route");
    const req = makeRequest("http://localhost:3000/api/admin/marken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Siemens" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});
