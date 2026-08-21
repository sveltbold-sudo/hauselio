import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  }),
}));

const mockPrisma = {
  adminUser: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  getRemainingAttempts: vi.fn().mockResolvedValue({ remaining: 5, retryAfterMs: 0 }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = "test-secret-key-for-unit-tests-32chars!!";
});

describe("authenticateAdmin", () => {
  it("returns admin on valid credentials", { timeout: 15000 }, async () => {
    const { hashPassword, authenticateAdmin } = await import("@/lib/auth");
    const hash = await hashPassword("correct-password");

    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@test.de",
      password: hash,
      role: "ADMIN",
      name: "Test Admin",
    });
    mockPrisma.adminUser.update.mockResolvedValue({});

    const result = await authenticateAdmin("admin@test.de", "correct-password");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("admin-1");
    expect(result?.email).toBe("admin@test.de");
    expect(result?.role).toBe("ADMIN");
    expect(mockPrisma.adminUser.update).toHaveBeenCalled();
  });

  it("returns null on wrong password", async () => {
    const { hashPassword, authenticateAdmin } = await import("@/lib/auth");
    const hash = await hashPassword("correct-password");

    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@test.de",
      password: hash,
      role: "ADMIN",
    });

    const result = await authenticateAdmin("admin@test.de", "wrong-password");
    expect(result).toBeNull();
  }, 15000);

  it("returns null on non-existent email (timing-safe)", async () => {
    const { authenticateAdmin } = await import("@/lib/auth");
    mockPrisma.adminUser.findUnique.mockResolvedValue(null);

    const result = await authenticateAdmin("nonexistent@test.de", "any-password");
    expect(result).toBeNull();
  });

  it("returns admin without name", async () => {
    const { hashPassword, authenticateAdmin } = await import("@/lib/auth");
    const hash = await hashPassword("password123");

    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-2",
      email: "admin2@test.de",
      password: hash,
      role: "EDITOR",
      name: null,
    });
    mockPrisma.adminUser.update.mockResolvedValue({});

    const result = await authenticateAdmin("admin2@test.de", "password123");
    expect(result).not.toBeNull();
    expect(result?.name).toBeUndefined();
    expect(result?.role).toBe("EDITOR");
  }, 15000);

  it("returns null when verifyPassword throws (malformed hash)", async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-3",
      email: "admin3@test.de",
      password: "not-a-valid-bcrypt-hash",
      role: "ADMIN",
    });

    const { authenticateAdmin } = await import("@/lib/auth");
    const result = await authenticateAdmin("admin3@test.de", "password");
    expect(result).toBeNull();
  });
});

describe("checkLoginLockout", () => {
  it("returns not locked when admin has no lockout", async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      lockedUntil: null,
    });

    const { checkLoginLockout } = await import("@/lib/auth");
    const result = await checkLoginLockout("admin@test.de");
    expect(result.locked).toBe(false);
  });

  it("returns not locked when admin not found", async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue(null);

    const { checkLoginLockout } = await import("@/lib/auth");
    const result = await checkLoginLockout("unknown@test.de");
    expect(result.locked).toBe(false);
  });

  it("returns locked when lockout is in the future", async () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000);
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      lockedUntil: futureDate,
    });

    const { checkLoginLockout } = await import("@/lib/auth");
    const result = await checkLoginLockout("admin@test.de");
    expect(result.locked).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("unlocks when lockout has expired", async () => {
    const pastDate = new Date(Date.now() - 1000);
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      lockedUntil: pastDate,
    });
    mockPrisma.adminUser.update.mockResolvedValue({});

    const { checkLoginLockout } = await import("@/lib/auth");
    const result = await checkLoginLockout("admin@test.de");
    expect(result.locked).toBe(false);
    expect(mockPrisma.adminUser.update).toHaveBeenCalledWith({
      where: { email: "admin@test.de" },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  });
});

describe("recordFailedLogin", () => {
  it("increments failed attempts", async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({ id: "admin-1" });
    mockPrisma.adminUser.update.mockResolvedValue({ failedAttempts: 3 });

    const { recordFailedLogin } = await import("@/lib/auth");
    await recordFailedLogin("admin@test.de");

    expect(mockPrisma.adminUser.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { failedAttempts: { increment: 1 } },
      })
    );
  });

  it("locks account after MAX_FAILED_ATTEMPTS (5)", async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({ id: "admin-1" });
    mockPrisma.adminUser.update
      .mockResolvedValueOnce({ failedAttempts: 5 })
      .mockResolvedValueOnce({});

    const { recordFailedLogin } = await import("@/lib/auth");
    await recordFailedLogin("admin@test.de");

    expect(mockPrisma.adminUser.update).toHaveBeenCalledTimes(2);
    expect(mockPrisma.adminUser.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lockedUntil: expect.any(Date) }),
      })
    );
  });

  it("does nothing for unknown email", async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue(null);

    const { recordFailedLogin } = await import("@/lib/auth");
    await recordFailedLogin("unknown@test.de");

    expect(mockPrisma.adminUser.update).not.toHaveBeenCalled();
  });
});

describe("resetFailedLogins", () => {
  it("resets failed attempts and lockout", async () => {
    mockPrisma.adminUser.update.mockResolvedValue({});

    const { resetFailedLogins } = await import("@/lib/auth");
    await resetFailedLogins("admin@test.de");

    expect(mockPrisma.adminUser.update).toHaveBeenCalledWith({
      where: { email: "admin@test.de" },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  });
});

describe("verifyPassword with malformed hash", () => {
  it("returns false instead of throwing", async () => {
    const { verifyPassword } = await import("@/lib/auth");
    const result = await verifyPassword("password", "not-a-bcrypt-hash");
    expect(result).toBe(false);
  });

  it("returns false for empty hash", async () => {
    const { verifyPassword } = await import("@/lib/auth");
    const result = await verifyPassword("password", "");
    expect(result).toBe(false);
  });
});
