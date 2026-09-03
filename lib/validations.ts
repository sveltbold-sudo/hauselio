import { z } from "zod";

export const CreateOrderSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  firstName: z.string().min(1, "Vorname ist erforderlich").max(100),
  lastName: z.string().min(1, "Nachname ist erforderlich").max(100),
  phone: z.string().max(30).regex(/^\+?[\d\s\-\(\)]{7,20}$/, "Ungültige Telefonnummer").optional().nullable(),
  address: z.string().min(1, "Adresse ist erforderlich").max(200),
  city: z.string().min(1, "Stadt ist erforderlich").max(100),
  zip: z.string().min(1, "PLZ ist erforderlich").regex(/^\d{4,5}$/, "PLZ muss 4 oder 5 Ziffern enthalten (DE/AT/CH)").max(10),
  country: z.string().min(2).max(2).default("DE"),
  notes: z.string().max(2000).optional().nullable(),
  items: z.array(z.object({
    id: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
  })).min(1, "Mindestens ein Artikel erforderlich"),
  couponCode: z.string().max(50).optional().nullable(),
});

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
  name: z.string().min(1, "Name ist erforderlich").max(200),
  slug: z.string().min(1, "Slug ist erforderlich").max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten"),
  description: z.string().min(1, "Beschreibung ist erforderlich").max(10000),
  shortDesc: z.string().max(500).optional().nullable(),
  price: z.number().min(0.01, "Preis muss größer als 0 sein").max(999999.99),
  originalPrice: z.number().min(0).max(999999.99).optional().nullable(),
  categoryId: z.string().min(1, "Kategorie ist erforderlich"),
  brandId: z.string().optional().nullable(),
  isNew: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isPromo: z.boolean().optional().default(false),
  weight: z.number().min(0).optional().nullable(),
  features: z.array(z.string().max(500)).max(20).optional().default([]),
  specs: z.array(z.object({
    key: z.string().min(1).max(100),
    value: z.string().min(1).max(500),
  })).max(30).optional().default([]),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDesc: z.string().max(500).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const UpdateSettingsSchema = z.object({
  bankIban: z.string().max(100).optional(),
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
  defaultVatRate: z.number().min(0).max(100).optional(),
  invoicePrefix: z.string().max(10).optional(),
});

export const CreateBrandSchema = z.object({
  name: z.string().min(1, "Markenname ist erforderlich").max(100),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128),
});

export const CustomerLoginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100).optional(),
  phone: z.string().max(30).regex(/^\+?[\d\s\-\(\)]{7,20}$/, "Ungültige Telefonnummer").optional().nullable(),
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
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128),
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
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128),
  name: z.string().max(100).optional().nullable(),
  role: z.enum(["ADMIN", "EDITOR"]).default("ADMIN"),
});

export const UpdateAdminSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254).optional(),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein").max(128).optional(),
  name: z.string().max(100).optional().nullable(),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
});
