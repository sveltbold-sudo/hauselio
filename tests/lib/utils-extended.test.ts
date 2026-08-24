import { describe, it, expect } from "vitest";
import { formatPrice, slugify, generateOrderNumber } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats EUR correctly", { timeout: 15000 }, () => {
    expect(formatPrice(19.99)).toBe("19,99\u00a0€");
  });

  it("formats 0 correctly", () => {
    expect(formatPrice(0)).toBe("0,00\u00a0€");
  });

  it("formats large numbers", () => {
    expect(formatPrice(1499)).toBe("1.499,00\u00a0€");
  });

  it("formats decimals", () => {
    expect(formatPrice(549.5)).toBe("549,50\u00a0€");
  });
});

describe("slugify", () => {
  it("converts to lowercase slug", () => {
    expect(slugify("Thermomix TM7")).toBe("thermomix-tm7");
  });

  it("handles German characters", () => {
    expect(slugify("Küche & Kochen")).toBe("kueche-kochen");
  });

  it("removes special characters", () => {
    expect(slugify("Produkt #1 (Neu!)")).toBe("produkt-1-neu");
  });

  it("handles multiple spaces", () => {
    expect(slugify("  Mehrfache   Leerzeichen  ")).toBe("mehrfache-leerzeichen");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("-Test-")).toBe("test");
  });
});

describe("generateOrderNumber", () => {
  it("starts with HL-", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^HL-/);
  });

  it("has correct format", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^HL-\d{6}-[0-9A-F]{8}$/);
  });

  it("generates unique numbers", () => {
    const numbers = new Set<string>();
    for (let i = 0; i < 20; i++) {
      numbers.add(generateOrderNumber());
    }
    expect(numbers.size).toBe(20);
  });
});
