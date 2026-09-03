import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  testimonial: {
    findUnique: vi.fn(),
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
  const url = qs ? `http://localhost:3000/api/admin/testimonials?${qs}` : "http://localhost:3000/api/admin/testimonials";
  return new NextRequest(url);
}

function makePostRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/admin/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makePatchRequest(id: string, body: unknown) {
  return new NextRequest(`http://localhost:3000/api/admin/testimonials/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makePutRequest(id: string, body: unknown) {
  return new NextRequest(`http://localhost:3000/api/admin/testimonials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(id: string) {
  return new NextRequest(`http://localhost:3000/api/admin/testimonials/${id}`, {
    method: "DELETE",
    headers: { origin: "http://localhost:3000" },
  });
}

const validTestimonial = { name: "Max M.", rating: 5, content: "Tolles Produkt!" };

describe("GET /api/admin/testimonials", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns testimonials list with pending count", async () => {
    mockPrisma.testimonial.findMany.mockResolvedValue([{ id: "1", name: "Max" }]);
    mockPrisma.testimonial.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    const { GET } = await import("@/app/api/admin/testimonials/route");
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.testimonials).toHaveLength(1);
    expect(data.pendingCount).toBeDefined();
  });

  it("supports filter=approved", async () => {
    mockPrisma.testimonial.findMany.mockResolvedValue([]);
    mockPrisma.testimonial.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/testimonials/route");
    const res = await GET(makeGetRequest({ filter: "approved" }));
    expect(res.status).toBe(200);
  });

  it("supports filter=pending", async () => {
    mockPrisma.testimonial.findMany.mockResolvedValue([]);
    mockPrisma.testimonial.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/admin/testimonials/route");
    const res = await GET(makeGetRequest({ filter: "pending" }));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/admin/testimonials", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a testimonial", async () => {
    mockPrisma.testimonial.create.mockResolvedValue({ id: "1", ...validTestimonial });
    const { POST } = await import("@/app/api/admin/testimonials/route");
    const res = await POST(makePostRequest(validTestimonial));
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.testimonial.name).toBe("Max M.");
  });

  it("rejects missing required fields", async () => {
    const { POST } = await import("@/app/api/admin/testimonials/route");
    const res = await POST(makePostRequest({ name: "" }));
    expect(res.status).toBe(400);
  });

  it("rejects invalid rating", async () => {
    const { POST } = await import("@/app/api/admin/testimonials/route");
    const res = await POST(makePostRequest({ ...validTestimonial, rating: 6 }));
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/admin/testimonials/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates isApproved", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue({ id: "1", name: "Max" });
    mockPrisma.testimonial.update.mockResolvedValue({ id: "1", isApproved: true });
    const { PATCH } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PATCH(makePatchRequest("1", { isApproved: true }), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });

  it("rejects invalid fields", async () => {
    const { PATCH } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PATCH(makePatchRequest("1", { invalidField: true }), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(400);
  });

  it("rejects empty body", async () => {
    const { PATCH } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PATCH(makePatchRequest("1", {}), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(null);
    const { PATCH } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PATCH(makePatchRequest("999", { isApproved: true }), { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/testimonials/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("full update of a testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValueOnce({ id: "1" });
    mockPrisma.testimonial.update.mockResolvedValue({ id: "1", ...validTestimonial });
    const { PUT } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PUT(makePutRequest("1", validTestimonial), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });

  it("returns 404 for non-existent testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(null);
    const { PUT } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PUT(makePutRequest("999", validTestimonial), { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });

  it("rejects invalid data", async () => {
    const { PUT } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await PUT(makePutRequest("1", { name: "" }), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/testimonials/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes a testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue({ id: "1", name: "Max" });
    mockPrisma.testimonial.delete.mockResolvedValue({});
    const { DELETE } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await DELETE(makeDeleteRequest("1"), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("returns 404 for non-existent testimonial", async () => {
    mockPrisma.testimonial.findUnique.mockResolvedValue(null);
    const { DELETE } = await import("@/app/api/admin/testimonials/[id]/route");
    const res = await DELETE(makeDeleteRequest("999"), { params: Promise.resolve({ id: "999" }) });
    expect(res.status).toBe(404);
  });
});
