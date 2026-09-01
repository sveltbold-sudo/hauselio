-- Migration: Remove stock fields from Product, add couponDiscount to Order
-- Apply this in Supabase SQL Editor

-- 1. Add couponDiscount column to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "couponDiscount" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- 2. Remove inStock column from Product table
ALTER TABLE "Product" DROP COLUMN IF EXISTS "inStock";

-- 3. Remove stockQuantity column from Product table
ALTER TABLE "Product" DROP COLUMN IF EXISTS "stockQuantity";
