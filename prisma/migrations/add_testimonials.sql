-- Create Testimonial table
CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "product" TEXT,
    "avatar" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Testimonial_isApproved_idx" ON "Testimonial"("isApproved");
CREATE INDEX IF NOT EXISTS "Testimonial_isFeatured_idx" ON "Testimonial"("isFeatured");
CREATE INDEX IF NOT EXISTS "Testimonial_isApproved_isFeatured_idx" ON "Testimonial"("isApproved", "isFeatured");

-- Insert realistic testimonials
INSERT INTO "Testimonial" ("id", "name", "location", "rating", "content", "product", "isApproved", "isFeatured", "createdAt", "updatedAt")
VALUES
    ('clt1a00010000000000000001', 'Stefan M.', 'Berlin', 5, 'Hervorragende Beratung und blitzschnelle Lieferung. Der Jura E8 Kaffeevollautomat funktioniert einwandfrei. Kann HAUSELIO nur empfehlen!', 'Jura E8 Platinum', true, true, NOW(), NOW()),
    ('clt1a00010000000000000002', 'Anna K.', 'München', 4, 'Die Miele Waschmaschine wurde problemlos geliefert. Das Gerät läuft super. Einziger Kritikpunkt: Lieferung dauerte 3 statt 2 Tage.', 'Miele W1 Waschmaschine', true, true, NOW(), NOW()),
    ('clt1a00010000000000000003', 'Thomas B.', 'Hamburg', 5, 'Sehr kompetenter Kundendienst. Hatte eine Frage zur Installation und wurde sofort freundlich beraten. Top Service!', NULL, true, false, NOW(), NOW()),
    ('clt1a00010000000000000004', 'Julia H.', 'Köln', 4, 'Die KitchenAid Artisan kommt genau wie beschrieben. Preis war ok, Versand schnell. Gerne wieder!', 'KitchenAid Artisan', true, true, NOW(), NOW()),
    ('clt1a00010000000000000005', 'Michael S.', 'Frankfurt', 5, 'Der Dyson V15 Detect ist fantastisch. Das orange Licht zeigt jeden Staub. HAUSELIO hatte den besten Preis!', 'Dyson V15 Detect', true, false, NOW(), NOW()),
    ('clt1a00010000000000000006', 'Laura W.', 'Düsseldorf', 4, 'Gute Auswahl an Premium-Marken. Lieferung dauerte 3 Tage statt 2, aber das Gerät ist einwandfrei.', 'Samsung Bespoke Kühlschrank', true, false, NOW(), NOW()),
    ('clt1a00010000000000000007', 'Peter R.', 'Stuttgart', 5, 'Der Miele Staubsauger ist leistungsstark und leise. Preis war 150€ günstiger als bei der Konkurrenz. Top!', 'Miele Triflex HX2', true, true, NOW(), NOW()),
    ('clt1a00010000000000000008', 'Sandra L.', 'Leipzig', 4, 'Tolle Beratung beim Kauf der Miele Spülmaschine. Alles super gelaufen, gerne wieder!', 'Miele G 7310 SCU', true, false, NOW(), NOW()),
    ('clt1a00010000000000000009', 'Klaus D.', 'Dresden', 5, 'Die Siemens Kaffeemaschine ist einfach klasse. Der online-Shop ist übersichtlich und die Bezahlung per SEPA funktioniert super.', 'Siemens EQ.9 plus s500', true, false, NOW(), NOW()),
    ('clt1a00010000000000000010', 'Monika F.', 'Hannover', 4, 'Schnelle Lieferung und gutes Preis-Leistungs-Verhältnis. Die Bosch Spülmaschine läuft einwandfrei. Danke!', 'Bosch SMS4HVW00E', true, false, NOW(), NOW()),
    ('clt1a00010000000000000011', 'Alexander P.', 'Bremen', 4, 'Guter Service, aber die Lieferung könnte etwas schneller sein. Das LG Waschtrockner-Set ist Top!', 'LG WashTower', true, false, NOW(), NOW()),
    ('clt1a00010000000000000012', 'Christine W.', 'Münster', 5, 'Bin sehr zufrieden mit dem Vorwerk Kobold. HAUSELIO bietet wirklich faire Preise. Vielen Dank!', 'Vorwerk Kobold VK200', true, false, NOW(), NOW());
