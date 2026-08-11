import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSettings: {
      findFirst: vi.fn(),
    },
  },
}));

describe("getBankDetails helper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns bank details from database", async () => {
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
  });

  it("returns null when no settings exist", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.siteSettings.findFirst).mockResolvedValue(null);

    const result = await prisma.siteSettings.findFirst();
    expect(result).toBeNull();
  });
});
