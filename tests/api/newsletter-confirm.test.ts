import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPrisma = {
  newsletter: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), info: vi.fn() },
}));

function makeGetRequest(token: string | null) {
  const url = token
    ? `http://localhost:3000/api/newsletter/confirm?token=${token}`
    : "http://localhost:3000/api/newsletter/confirm";
  return new NextRequest(url);
}

function getRedirectUrl(res: Response): string {
  const location = res.headers.get("location") || "";
  return location;
}

describe("GET /api/newsletter/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to invalid when no token", async () => {
    const { GET } = await import("@/app/api/newsletter/confirm/route");
    const res = await GET(makeGetRequest(null));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toContain("newsletter=invalid");
  });

  it("redirects to invalid for non-existent token", async () => {
    mockPrisma.newsletter.findFirst.mockResolvedValue(null);
    const { GET } = await import("@/app/api/newsletter/confirm/route");
    const res = await GET(makeGetRequest("nonexistent-token"));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toContain("newsletter=invalid");
  });

  it("redirects to already-confirmed for confirmed subscriber", async () => {
    mockPrisma.newsletter.findFirst.mockResolvedValue({
      id: "1",
      confirmToken: "valid-token",
      confirmed: true,
      confirmExpiresAt: null,
    });
    const { GET } = await import("@/app/api/newsletter/confirm/route");
    const res = await GET(makeGetRequest("valid-token"));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toContain("newsletter=already-confirmed");
  });

  it("redirects to expired for expired token", async () => {
    mockPrisma.newsletter.findFirst.mockResolvedValue({
      id: "1",
      confirmToken: "expired-token",
      confirmed: false,
      confirmExpiresAt: new Date("2020-01-01"),
    });
    const { GET } = await import("@/app/api/newsletter/confirm/route");
    const res = await GET(makeGetRequest("expired-token"));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toContain("newsletter=expired");
  });

  it("confirms subscriber and redirects to success", async () => {
    mockPrisma.newsletter.findFirst.mockResolvedValue({
      id: "1",
      confirmToken: "good-token",
      confirmed: false,
      confirmExpiresAt: null,
    });
    mockPrisma.newsletter.update.mockResolvedValue({});
    const { GET } = await import("@/app/api/newsletter/confirm/route");
    const res = await GET(makeGetRequest("good-token"));
    expect(res.status).toBe(307);
    expect(getRedirectUrl(res)).toContain("newsletter=confirmed");
    expect(mockPrisma.newsletter.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        confirmed: true,
        confirmedAt: expect.any(Date),
        confirmToken: null,
      },
    });
  });
});
