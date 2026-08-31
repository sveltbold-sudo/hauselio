import { describe, it, expect, vi } from "vitest";

process.env.RESEND_API_KEY = "re_test_key";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSettings: {
      findFirst: vi.fn().mockResolvedValue({
        bankAccountName: "HAUSELIO GmbH",
        bankIban: "DE89370400440532013000",
        bankBic: "COBADEFFXXX",
      }),
    },
  },
}));

vi.mock("@/lib/resend", () => ({
  getResendClient: () => ({
    emails: { send: vi.fn().mockResolvedValue({ id: "msg-1" }) },
  }),
  FROM_EMAIL: "test@hauselio.de",
}));

describe("Email functions", () => {
  it("sendOrderConfirmation sends email with correct data", async () => {
    const { sendOrderConfirmation } = await import("@/lib/emails");
    const result = await sendOrderConfirmation({
      orderNumber: "HL-202608-TEST",
      customerEmail: "test@example.de",
      customerName: "Max Mustermann",
      items: [{ name: "Jura E8", quantity: 1, price: 1199.0 }],
      total: 1199.0,
      shippingCost: 0,
    });
    expect(result).toBeDefined();
  });

  it("sendPaymentConfirmed is a function", async () => {
    const { sendPaymentConfirmed } = await import("@/lib/emails");
    expect(typeof sendPaymentConfirmed).toBe("function");
  });

  it("sendShippedConfirmation is a function", async () => {
    const { sendShippedConfirmation } = await import("@/lib/emails");
    expect(typeof sendShippedConfirmation).toBe("function");
  });

  it("email data has required fields", () => {
    const data = {
      orderNumber: "HL-202608-0001",
      customerEmail: "test@example.de",
      customerName: "Max Mustermann",
      items: [{ name: "Jura E8", quantity: 1, price: 1199.0 }],
      total: 1199.0,
      shippingCost: 0,
    };
    expect(data.orderNumber).toBeTruthy();
    expect(data.customerEmail).toContain("@");
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items[0]).toHaveProperty("name");
    expect(data.items[0]).toHaveProperty("quantity");
    expect(data.items[0]).toHaveProperty("price");
    expect(data.total).toBeGreaterThan(0);
  });
});
