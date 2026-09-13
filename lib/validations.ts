import { z } from "zod";

export const CreateOrderSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  firstName: z.string().min(1, "Vorname ist erforderlich").max(100),
  lastName: z.string().min(1, "Nachname ist erforderlich").max(100),
  phone: z.string().max(30).regex(/^(?=.*\d)\+?[\d\s\-\(\)]{7,20}$/, "Ungültige Telefonnummer").optional().nullable(),
  address: z.string().min(1, "Adresse ist erforderlich").max(200),
  city: z.string().min(1, "Stadt ist erforderlich").max(100),
  zip: z.string().min(1, "PLZ ist erforderlich").regex(/^\d{4,5}$/, "PLZ muss 4 oder 5 Ziffern enthalten (DE/AT/CH)").max(10),
  country: z.enum(["DE", "AT", "CH"]).default("DE"),
  notes: z.string().max(2000).optional().nullable(),
  items: z.array(z.object({
    id: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
  })).min(1, "Mindestens ein Artikel erforderlich"),
  couponCode: z.string().max(50).optional().nullable(),
});

export const PASSWORD_RULES = z.string()
  .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
  .max(128, "Passwort darf maximal 128 Zeichen lang sein")
  .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
  .regex(/[0-9]/, "Passwort muss mindestens eine Ziffer enthalten")
  .regex(/[^A-Za-z0-9]/, "Passwort muss mindestens ein Sonderzeichen enthalten");

export const LoginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128, "Passwort darf maximal 128 Zeichen lang sein"),
});

export const ContactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export const CreateProductSchema = z.object({
  name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein.").max(200),
  slug: z.string().min(1, "Slug ist erforderlich").max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein.").max(10000),
  shortDesc: z.string().max(500).optional().nullable(),
  price: z.number().min(0.01, "Preis muss größer als 0 sein").max(999999.99),
  originalPrice: z.number().min(0).max(999999.99).optional().nullable(),
  sku: z.string().max(50).optional().nullable(),
  barcode: z.string().max(50).optional().nullable(),
  categoryId: z.string().min(1, "Kategorie ist erforderlich"),
  brandId: z.string().optional().nullable(),
  isNew: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isPromo: z.boolean().optional().default(false),
  isDailyDeal: z.boolean().optional().default(false),
  weight: z.number().min(0).optional().nullable(),
  features: z.array(z.string().max(500)).max(20).optional().default([]),
  specs: z.array(z.object({
    key: z.string().min(1).max(100),
    value: z.string().min(1).max(500),
  })).max(30).optional().default([]),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDesc: z.string().max(500).optional().nullable(),
  imageUrl: z.string().refine((u) => u.startsWith("https://") || u.startsWith("/") || u.startsWith("http://localhost"), { message: "URL muss mit https:// beginnen oder ein lokaler Pfad sein" }).optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string().refine((u) => u.startsWith("https://") || u.startsWith("/") || u.startsWith("http://localhost"), { message: "URL muss mit https:// beginnen oder ein lokaler Pfad sein" }),
    publicId: z.string().optional().nullable(),
    position: z.number().int().min(0).optional(),
  })).max(10).optional().default([]),
}).refine((data) => !data.originalPrice || data.originalPrice > data.price, {
  message: "Originalpreis muss größer als der Verkaufspreis sein",
  path: ["originalPrice"],
});

export const UpdateSettingsSchema = z.object({
  bankIban: z.preprocess((v) => (typeof v === "string" ? v.replace(/\s/g, "") : v), z.string().regex(/^(DE\d{20}|AT\d{18}|CH\d{21}|FR\d{27}|NL\d{14}|BE\d{16}|ES\d{24}|IT\d{27}|PL\d{28})$/i, "Ungültige IBAN").max(100).optional()),
  bankBic: z.string().max(20).optional(),
  bankAccountName: z.string().max(200).optional(),
  bankName: z.string().max(200).optional(),
  shippingInfo: z.string().max(2000).optional(),
  contactEmail: z.string().email("Ungültige E-Mail-Adresse").max(254).optional(),
  contactPhone: z.string().max(30).optional(),
  contactAddress: z.string().max(500).optional(),
  companyName: z.string().max(200).optional(),
  companyAddress: z.string().max(500).optional(),
  vatId: z.string().max(50).optional(),
  managingDirector: z.string().max(200).optional(),
  defaultVatRate: z.number().min(0).max(100).optional(),
  invoicePrefix: z.string().min(1, "Rechnungspräfix ist erforderlich").max(10).regex(/^[A-Za-z0-9_-]+$/, "Nur alphanumerische Zeichen erlaubt").optional(),
});

export const CreateBrandSchema = z.object({
  name: z.string().min(1, "Markenname ist erforderlich").max(100),
  slug: z.string().max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten").optional(),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  password: PASSWORD_RULES,
});

export const CustomerLoginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100).optional(),
  phone: z.string().max(30).regex(/^(?=.*\d)\+?[\d\s\-\(\)]{7,20}$/, "Ungültige Telefonnummer").optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  zip: z.string().regex(/^\d{4,5}$/, "PLZ muss 4 oder 5 Ziffern enthalten").optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().min(2).max(2).optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token ist erforderlich"),
  password: PASSWORD_RULES,
});

export const CreateCouponSchema = z.object({
  code: z.string().min(1, "Gutscheincode ist erforderlich").max(50).regex(/^[A-Z0-9]+(-[A-Z0-9]+)*$/, "Code darf nur Großbuchstaben, Zahlen und Bindestriche enthalten"),
  discountPercent: z.number().int().min(1, "Mindestens 1%").max(100, "Maximal 100%"),
  maxUses: z.number().int().min(0).default(0),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const CreateTestimonialSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  location: z.string().max(100).optional().nullable(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1, "Inhalt ist erforderlich").max(2000),
  product: z.string().max(200).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  isApproved: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const CreateAdminSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  password: PASSWORD_RULES,
  name: z.string().max(100).optional().nullable(),
  role: z.enum(["ADMIN", "EDITOR"]).default("ADMIN"),
});

export const UpdateAdminSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254).optional(),
  password: PASSWORD_RULES.optional(),
  name: z.string().max(100).optional().nullable(),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
});
