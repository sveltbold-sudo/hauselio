import { describe, it, expect } from "vitest";
import {
  CreateOrderSchema,
  LoginSchema,
  ContactSchema,
  CreateProductSchema,
  UpdateSettingsSchema,
  CreateBrandSchema,
} from "@/lib/validations";

describe("CreateOrderSchema", () => {
  const validOrder = {
    email: "test@example.de",
    firstName: "Max",
    lastName: "Mustermann",
    address: "Musterstraße 1",
    city: "Berlin",
    zip: "10115",
    country: "DE",
    items: [{ id: "prod-1", quantity: 2 }],
  };

  it("accepts valid order", () => {
    expect(CreateOrderSchema.safeParse(validOrder).success).toBe(true);
  });

  it("rejects empty items", () => {
    expect(CreateOrderSchema.safeParse({ ...validOrder, items: [] }).success).toBe(false);
  });

  it("rejects quantity > 99", () => {
    expect(CreateOrderSchema.safeParse({ ...validOrder, items: [{ id: "a", quantity: 100 }] }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(CreateOrderSchema.safeParse({ ...validOrder, email: "not-an-email" }).success).toBe(false);
  });

  it("allows optional fields to be null", () => {
    expect(CreateOrderSchema.safeParse({ ...validOrder, phone: null, notes: null }).success).toBe(true);
  });

  it("defaults country to DE", () => {
    const result = CreateOrderSchema.safeParse({ ...validOrder, country: undefined });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.country).toBe("DE");
  });
});

describe("LoginSchema", () => {
  it("accepts valid login", () => {
    expect(LoginSchema.safeParse({ email: "a@b.de", password: "12345678" }).success).toBe(true);
  });

  it("rejects empty email", () => {
    expect(LoginSchema.safeParse({ email: "", password: "123" }).success).toBe(false);
  });

  it("rejects empty password", () => {
    expect(LoginSchema.safeParse({ email: "a@b.de", password: "" }).success).toBe(false);
  });

  it("rejects password > 128 chars", () => {
    expect(LoginSchema.safeParse({ email: "a@b.de", password: "x".repeat(129) }).success).toBe(false);
  });

  it("accepts password of exactly 128 chars", () => {
    expect(LoginSchema.safeParse({ email: "a@b.de", password: "x".repeat(128) }).success).toBe(true);
  });

  it("rejects invalid email format", () => {
    expect(LoginSchema.safeParse({ email: "invalid", password: "123" }).success).toBe(false);
  });
});

describe("ContactSchema", () => {
  const validContact = {
    firstName: "Max",
    lastName: "Mustermann",
    email: "max@example.de",
    subject: "Frage",
    message: "Hallo, ich habe eine Frage.",
  };

  it("accepts valid contact", () => {
    expect(ContactSchema.safeParse(validContact).success).toBe(true);
  });

  it("rejects empty firstName", () => {
    expect(ContactSchema.safeParse({ ...validContact, firstName: "" }).success).toBe(false);
  });

  it("rejects message > 5000 chars", () => {
    expect(ContactSchema.safeParse({ ...validContact, message: "x".repeat(5001) }).success).toBe(false);
  });

  it("accepts message of exactly 5000 chars", () => {
    expect(ContactSchema.safeParse({ ...validContact, message: "x".repeat(5000) }).success).toBe(true);
  });
});

describe("CreateProductSchema", () => {
  const validProduct = {
    name: "Test Produkt",
    slug: "test-produkt",
    description: "Eine Beschreibung",
    price: 99.99,
    categoryId: "cat-1",
    features: [],
    specs: [],
  };

  it("accepts valid product", () => {
    expect(CreateProductSchema.safeParse(validProduct).success).toBe(true);
  });

  it("rejects slug with uppercase", () => {
    expect(CreateProductSchema.safeParse({ ...validProduct, slug: "Test-Slug" }).success).toBe(false);
  });

  it("rejects slug with spaces", () => {
    expect(CreateProductSchema.safeParse({ ...validProduct, slug: "test slug" }).success).toBe(false);
  });

  it("accepts slug with hyphens", () => {
    expect(CreateProductSchema.safeParse({ ...validProduct, slug: "test-produkt-2" }).success).toBe(true);
  });

  it("rejects negative price", () => {
    expect(CreateProductSchema.safeParse({ ...validProduct, price: -1 }).success).toBe(false);
  });

  it("rejects empty name", () => {
    expect(CreateProductSchema.safeParse({ ...validProduct, name: "" }).success).toBe(false);
  });
});

describe("UpdateSettingsSchema", () => {
  it("accepts empty object (all optional)", () => {
    expect(UpdateSettingsSchema.safeParse({}).success).toBe(true);
  });

  it("accepts valid IBAN", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "DE89 3704 0044 0532 0130 00" }).success).toBe(true);
  });

  it("accepts valid email", () => {
    expect(UpdateSettingsSchema.safeParse({ contactEmail: "test@test.de" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(UpdateSettingsSchema.safeParse({ contactEmail: "not-email" }).success).toBe(false);
  });
});

describe("CreateBrandSchema", () => {
  it("accepts valid brand name", () => {
    expect(CreateBrandSchema.safeParse({ name: "Miele" }).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(CreateBrandSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects name > 100 chars", () => {
    expect(CreateBrandSchema.safeParse({ name: "x".repeat(101) }).success).toBe(false);
  });

  it("accepts name of exactly 100 chars", () => {
    expect(CreateBrandSchema.safeParse({ name: "x".repeat(100) }).success).toBe(true);
  });
});
