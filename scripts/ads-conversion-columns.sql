-- HAUSAURA — Google Ads server-side conversion import
-- A executer UNE FOIS dans Supabase > SQL Editor AVANT de deployer le code
-- (colonnes nullable => sans risque, aucun wipe)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "gclid" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "gbraid" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "wbraid" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "adsConversionUploadedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "adsUploadAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "adsUploadError" TEXT;
