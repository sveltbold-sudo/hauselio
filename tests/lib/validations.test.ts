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

  // IBAN validation
  it("accepts valid IBAN with spaces", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "DE89 3704 0044 0532 0130 00" }).success).toBe(true);
  });

  it("accepts valid IBAN without spaces", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "DE89370400440532013000" }).success).toBe(true);
  });

  it("accepts valid IBAN lowercase (case-insensitive)", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "de89 3704 0044 0532 0130 00" }).success).toBe(true);
  });

  it("rejects IBAN without country code", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "89 3704 0044 0532 0130 00" }).success).toBe(false);
  });

  it("rejects IBAN too short", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "DE89 3704" }).success).toBe(false);
  });

  it("rejects IBAN with special characters", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "DE89-3704-0044-0532-0130-00" }).success).toBe(false);
  });

  // Email validation
  it("accepts valid email", () => {
    expect(UpdateSettingsSchema.safeParse({ contactEmail: "test@test.de" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(UpdateSettingsSchema.safeParse({ contactEmail: "not-email" }).success).toBe(false);
  });

  it("rejects email without domain", () => {
    expect(UpdateSettingsSchema.safeParse({ contactEmail: "test@" }).success).toBe(false);
  });

  // managingDirector
  it("accepts managingDirector", () => {
    expect(UpdateSettingsSchema.safeParse({ managingDirector: "Max Mustermann" }).success).toBe(true);
  });

  it("rejects managingDirector > 200 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ managingDirector: "x".repeat(201) }).success).toBe(false);
  });

  it("accepts managingDirector of exactly 200 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ managingDirector: "x".repeat(200) }).success).toBe(true);
  });

  // invoicePrefix
  it("accepts valid invoicePrefix", () => {
    expect(UpdateSettingsSchema.safeParse({ invoicePrefix: "RE" }).success).toBe(true);
  });

  it("rejects empty invoicePrefix", () => {
    expect(UpdateSettingsSchema.safeParse({ invoicePrefix: "" }).success).toBe(false);
  });

  it("rejects invoicePrefix > 10 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ invoicePrefix: "x".repeat(11) }).success).toBe(false);
  });

  it("accepts invoicePrefix of exactly 10 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ invoicePrefix: "x".repeat(10) }).success).toBe(true);
  });

  // defaultVatRate
  it("accepts valid VAT rate", () => {
    expect(UpdateSettingsSchema.safeParse({ defaultVatRate: 19 }).success).toBe(true);
  });

  it("accepts VAT rate of 0", () => {
    expect(UpdateSettingsSchema.safeParse({ defaultVatRate: 0 }).success).toBe(true);
  });

  it("accepts VAT rate of 100", () => {
    expect(UpdateSettingsSchema.safeParse({ defaultVatRate: 100 }).success).toBe(true);
  });

  it("rejects negative VAT rate", () => {
    expect(UpdateSettingsSchema.safeParse({ defaultVatRate: -1 }).success).toBe(false);
  });

  it("rejects VAT rate > 100", () => {
    expect(UpdateSettingsSchema.safeParse({ defaultVatRate: 101 }).success).toBe(false);
  });

  // shippingInfo
  it("accepts valid shippingInfo", () => {
    expect(UpdateSettingsSchema.safeParse({ shippingInfo: "Versand innerhalb Deutschlands" }).success).toBe(true);
  });

  it("rejects shippingInfo > 2000 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ shippingInfo: "x".repeat(2001) }).success).toBe(false);
  });

  // field max lengths
  it("rejects bankIban > 100 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ bankIban: "x".repeat(101) }).success).toBe(false);
  });

  it("rejects bankBic > 20 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ bankBic: "x".repeat(21) }).success).toBe(false);
  });

  it("rejects bankAccountName > 200 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ bankAccountName: "x".repeat(201) }).success).toBe(false);
  });

  it("rejects bankName > 200 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ bankName: "x".repeat(201) }).success).toBe(false);
  });

  it("rejects contactPhone > 30 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ contactPhone: "x".repeat(31) }).success).toBe(false);
  });

  it("rejects contactAddress > 500 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ contactAddress: "x".repeat(501) }).success).toBe(false);
  });

  it("rejects companyName > 200 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ companyName: "x".repeat(201) }).success).toBe(false);
  });

  it("rejects companyAddress > 500 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ companyAddress: "x".repeat(501) }).success).toBe(false);
  });

  it("rejects vatId > 50 chars", () => {
    expect(UpdateSettingsSchema.safeParse({ vatId: "x".repeat(51) }).success).toBe(false);
  });

  // combined valid settings
  it("accepts complete valid settings object", () => {
    expect(UpdateSettingsSchema.safeParse({
      bankIban: "DE89 3704 0044 0532 0130 00",
      bankBic: "COBADEFFXXX",
      bankAccountName: "HAUSAURA GmbH",
      bankName: "Commerzbank",
      shippingInfo: "Gratis Versand ab 50€",
      contactEmail: "info@hausaura.de",
      contactPhone: "+49 (0)1525 9140453",
      contactAddress: "Kastanienallee 42, 10435 Berlin",
      companyName: "HAUSAURA GmbH",
      companyAddress: "Kastanienallee 42, 10435 Berlin",
      vatId: "DE 312 847 609",
      managingDirector: "Max Mustermann",
      defaultVatRate: 19,
      invoicePrefix: "RE",
    }).success).toBe(true);
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
