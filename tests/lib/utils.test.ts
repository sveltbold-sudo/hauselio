import { describe, it, expect } from "vitest";
import { formatPrice, slugify, generateOrderNumber } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats EUR amounts correctly", { timeout: 15000 }, () => {
    const result = formatPrice(29.99);
    expect(result).toContain("29");
    expect(result).toContain("99");
    expect(result).toContain("€");
  });

  it("handles zero", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
  });

  it("handles large amounts", () => {
    const result = formatPrice(1299.99);
    expect(result).toContain("1.299");
    expect(result).toContain("99");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles German characters", () => {
    expect(slugify("Müller Öfen")).toBe("mueller-oefen");
  });

  it("removes special characters", () => {
    expect(slugify("Product! @#$%")).toBe("product");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("  hello   world  ")).toBe("hello-world");
  });
});

describe("generateOrderNumber", () => {
  it("generates a string starting with HL", () => {
    const result = generateOrderNumber();
    expect(result).toMatch(/^HL-/);
  });

  it("generates unique numbers", () => {
    const result1 = generateOrderNumber();
    const result2 = generateOrderNumber();
    expect(result1).not.toBe(result2);
  });
});
