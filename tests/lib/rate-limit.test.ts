import { describe, it, expect } from "vitest";

describe("Rate Limiting", () => {
  it("allows requests within limit", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");

    const result = await checkRateLimit("test-key-unique-" + Date.now(), 5, 60000);
    expect(result).toBe(true);
  });

  it("blocks requests over limit", async () => {
    const { checkRateLimit } = await import("@/lib/rate-limit");
    const key = "test-rate-limit-block-" + Date.now();

    for (let i = 0; i < 3; i++) {
      await checkRateLimit(key, 3, 60000);
    }

    const result = await checkRateLimit(key, 3, 60000);
    expect(result).toBe(false);
  });
});
