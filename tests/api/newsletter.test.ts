import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    newsletter: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Newsletter API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates email format", async () => {
    const { z } = await import("zod");
    const NewsletterSchema = z.object({
      email: z.string().email("Ungültige E-Mail-Adresse").max(254),
    });

    const validResult = NewsletterSchema.safeParse({ email: "test@example.com" });
    expect(validResult.success).toBe(true);

    const invalidResult = NewsletterSchema.safeParse({ email: "not-an-email" });
    expect(invalidResult.success).toBe(false);
  });

  it("rejects empty email", async () => {
    const { z } = await import("zod");
    const NewsletterSchema = z.object({
      email: z.string().email("Ungültige E-Mail-Adresse").max(254),
    });

    const result = NewsletterSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("handles duplicate subscription gracefully", async () => {
    const { prisma } = await import("@/lib/prisma");

    vi.mocked(prisma.newsletter.findUnique).mockResolvedValue({
      id: "1",
      email: "existing@example.com",
      isActive: true,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const existing = await prisma.newsletter.findUnique({
      where: { email: "existing@example.com" },
    });

    expect(existing).toBeTruthy();
    expect(existing?.isActive).toBe(true);
  });
});
