import { describe, it, expect } from "vitest";

// Product data structure tests
interface ProductRecord {
  objectID: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  brand: string | null;
  categoryName: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isPromo: boolean;
  description: string;
}

function validateProductRecord(record: ProductRecord): string[] {
  const errors: string[] = [];

  if (!record.objectID) errors.push("objectID is required");
  if (!record.name || record.name.length < 2) errors.push("name must be at least 2 chars");
  if (!record.slug || record.slug.length < 2) errors.push("slug must be at least 2 chars");
  if (record.price < 0) errors.push("price cannot be negative");
  if (record.rating < 0 || record.rating > 5) errors.push("rating must be 0-5");
  if (record.reviewCount < 0) errors.push("reviewCount cannot be negative");
  if (!record.categoryName) errors.push("categoryName is required");

  return errors;
}

describe("Product Record Validation", () => {
  const validRecord: ProductRecord = {
    objectID: "abc-123",
    name: "Jura E8 Platinum",
    slug: "jura-e8-platinum",
    price: 1199.0,
    originalPrice: 1299.0,
    brand: "Jura",
    categoryName: "Kaffee",
    categorySlug: "kaffee",
    image: "/images/products/jura-e8.jpg",
    rating: 4.8,
    reviewCount: 156,
    isNew: false,
    isPromo: true,
    description: "Premium Kaffeevollautomat",
  };

  it("validates a correct record", () => {
    const errors = validateProductRecord(validRecord);
    expect(errors).toHaveLength(0);
  });

  it("requires objectID", () => {
    const errors = validateProductRecord({ ...validRecord, objectID: "" });
    expect(errors).toContain("objectID is required");
  });

  it("requires name", () => {
    const errors = validateProductRecord({ ...validRecord, name: "" });
    expect(errors).toContain("name must be at least 2 chars");
  });

  it("rejects negative price", () => {
    const errors = validateProductRecord({ ...validRecord, price: -10 });
    expect(errors).toContain("price cannot be negative");
  });

  it("rejects rating > 5", () => {
    const errors = validateProductRecord({ ...validRecord, rating: 6 });
    expect(errors).toContain("rating must be 0-5");
  });

  it("rejects negative reviewCount", () => {
    const errors = validateProductRecord({ ...validRecord, reviewCount: -1 });
    expect(errors).toContain("reviewCount cannot be negative");
  });

  it("requires categoryName", () => {
    const errors = validateProductRecord({ ...validRecord, categoryName: "" });
    expect(errors).toContain("categoryName is required");
  });

  it("collects multiple errors", () => {
    const errors = validateProductRecord({
      ...validRecord,
      objectID: "",
      name: "",
      price: -1,
    });
    expect(errors.length).toBeGreaterThanOrEqual(3);
  });
});
