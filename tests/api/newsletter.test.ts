import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  newsletter: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
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

vi.mock("@/lib/emails", () => ({
  sendNewsletterConfirmation: vi.fn().mockResolvedValue(undefined),
}));

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost:3000/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes a new email", async () => {
    mockPrisma.newsletter.findUnique.mockResolvedValue(null);
    mockPrisma.newsletter.create.mockResolvedValue({ id: "1", email: "new@test.de" });

    const { POST } = await import("@/app/api/newsletter/route");
    const res = await POST(makeRequest({ email: "new@test.de" }));
    expect(res.status).toBe(200);
    expect(mockPrisma.newsletter.create).toHaveBeenCalled();
  });

  it("rejects invalid email", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("rejects empty body", async () => {
    const { POST } = await import("@/app/api/newsletter/route");
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("handles existing confirmed subscriber", async () => {
    mockPrisma.newsletter.findUnique.mockResolvedValue({
      id: "1",
      email: "existing@test.de",
      isActive: true,
      confirmed: true,
    });

    const { POST } = await import("@/app/api/newsletter/route");
    const res = await POST(makeRequest({ email: "existing@test.de" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
