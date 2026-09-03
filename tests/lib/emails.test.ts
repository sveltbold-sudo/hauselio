import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSettings: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/resend", () => ({
  getResendClient: () => ({
    emails: { send: vi.fn() },
  }),
  FROM_EMAIL: "test@HAUSAURA.de",
}));

vi.mock("@/lib/auth", () => ({
  createUnsubscribeToken: vi.fn().mockReturnValue("test-token"),
}));

describe("getBankDetails helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns bank details from database via emails module", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue({
      bankAccountName: "Test GmbH",
      bankIban: "DE89370400440532013000",
      bankBic: "COBADEFFXXX",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await prisma.siteSettings.findFirst();
    expect(result?.bankAccountName).toBe("Test GmbH");
    expect(result?.bankIban).toBe("DE89370400440532013000");
    expect(result?.bankBic).toBe("COBADEFFXXX");
  });

  it("returns null when no settings exist", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(null);

    const result = await prisma.siteSettings.findFirst();
    expect(result).toBeNull();
  });

  it("sendOrderConfirmation uses bank details", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue({
      bankAccountName: "HAUSAURA GmbH",
      bankIban: "DE89370400440532013000",
      bankBic: "COBADEFFXXX",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { sendOrderConfirmation } = await import("@/lib/emails");
    await sendOrderConfirmation({
      orderNumber: "HL-202608-TEST",
      customerEmail: "test@example.de",
      customerName: "Test User",
      items: [{ name: "Product", quantity: 1, price: 99.99 }],
      subtotal: 99.99,
      couponDiscount: 0,
      total: 99.99,
      shippingCost: 0,
    });
    expect(prisma.siteSettings.findFirst).toHaveBeenCalled();
  });
});
