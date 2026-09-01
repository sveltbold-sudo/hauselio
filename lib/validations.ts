import { z } from "zod";

export const CreateOrderSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").max(254),
  firstName: z.string().min(1, "Vorname ist erforderlich").max(100),
  lastName: z.string().min(1, "Nachname ist erforderlich").max(100),
  phone: z.string().max(30).optional().nullable(),
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
  price: z.number().min(0, "Preis muss positiv sein").max(999999.99),
  originalPrice: z.number().min(0).max(999999.99).optional().nullable(),
  categoryId: z.string().min(1, "Kategorie ist erforderlich"),
  brandId: z.string().optional().nullable(),
  isNew: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  weight: z.number().min(0).optional().nullable(),
  features: z.array(z.string().max(500)).max(20).optional().default([]),
  specs: z.array(z.object({
    key: z.string().min(1).max(100),
    value: z.string().min(1).max(500),
  })).max(30).optional().default([]),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDesc: z.string().max(500).optional().nullable(),
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
  password: z.string().min(1, "Passwort ist erforderlich").max(128),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100).optional(),
  phone: z.string().max(30).optional().nullable(),
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
