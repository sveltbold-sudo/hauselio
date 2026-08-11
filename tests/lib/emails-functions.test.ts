import { describe, it, expect } from "vitest";

// Mock env before import
process.env.RESEND_API_KEY = "re_test_key";

const mockOrderData = {
  orderNumber: "HL-202608-0001",
  customerEmail: "test@example.de",
  customerName: "Max Mustermann",
  items: [
    { name: "Jura E8 Platinum", quantity: 1, price: 1199.0 },
    { name: "Dyson V15 Detect", quantity: 2, price: 749.0 },
  ],
  total: 2697.0,
  shippingCost: 0,
};

describe("Email functions", () => {
  it("sendOrderConfirmation is a function", async () => {
    const { sendOrderConfirmation } = await import("@/lib/emails");
    expect(typeof sendOrderConfirmation).toBe("function");
  });

  it("sendPaymentConfirmed is a function", async () => {
    const { sendPaymentConfirmed } = await import("@/lib/emails");
    expect(typeof sendPaymentConfirmed).toBe("function");
  });

  it("sendShippedConfirmation accepts 2 params", async () => {
    const { sendShippedConfirmation } = await import("@/lib/emails");
    expect(sendShippedConfirmation.length).toBe(2);
  });

  it("email data has required fields", () => {
    expect(mockOrderData.orderNumber).toBeTruthy();
    expect(mockOrderData.customerEmail).toContain("@");
    expect(mockOrderData.items.length).toBeGreaterThan(0);
    expect(mockOrderData.items[0]).toHaveProperty("name");
    expect(mockOrderData.items[0]).toHaveProperty("quantity");
    expect(mockOrderData.items[0]).toHaveProperty("price");
    expect(mockOrderData.total).toBeGreaterThan(0);
  });
});
