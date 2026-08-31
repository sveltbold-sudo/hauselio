-- HAUSAURA — Seed Data
-- Exécuter APRÈS schema.sql dans Supabase SQL Editor
-- Supprime les anciennes données puis réinsère (idempotent)

-- 0. Clear existing seed data
DELETE FROM "Review";
DELETE FROM "OrderItem";
DELETE FROM "Order";
DELETE FROM "Newsletter";
DELETE FROM "ProductSpec";
DELETE FROM "ProductImage";
DELETE FROM "Product";
DELETE FROM "Category";
DELETE FROM "Brand";
DELETE FROM "AdminUser";
DELETE FROM "SiteSettings";

-- 1. Admin User (password: admin123)
DO $$ BEGIN
  ALTER TABLE "AdminUser" ADD COLUMN "failedAttempts" INTEGER NOT NULL DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "AdminUser" ADD COLUMN "lockedUntil" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "AdminUser" ADD COLUMN "lastLogin" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

INSERT INTO "AdminUser" ("id", "email", "password", "name", "role", "failedAttempts", "createdAt", "updatedAt")
VALUES ('admin-001', 'admin@hausaura.de', '$2b$12$X6IA3ezAD0t5/6SoVy3HLeDY33i2R8DcsC3v30KPHFHROpyvAjvge', 'Admin', 'ADMIN', 0, NOW(), NOW());

-- 2. Site Settings
INSERT INTO "SiteSettings" ("id", "bankName", "bankIban", "bankBic", "bankAccountName", "shippingInfo", "contactEmail", "contactPhone", "contactAddress", "createdAt", "updatedAt")
VALUES ('settings-001', 'Commerzbank Berlin', 'DE89 3704 0044 0532 0130 00', 'COBADEFFXXX', 'HAUSAURA GmbH', 'Kostenloser Versand ab 50€ Bestellwert. Standard-Versand: 4,99€.', 'info@hausaura.de', '+49 (0)30 555 789 01', 'Kastanienallee 42, 10435 Berlin', NOW(), NOW());

-- 3. Categories
INSERT INTO "Category" ("id", "name", "slug", "description", "image", "sortOrder", "createdAt", "updatedAt") VALUES
('cat-kueche', 'Küche & Kochen', 'kueche', 'Hochwertige Küchengeräte für anspruchsvolle Köche', '/images/categories/kueche.jpg', 0, NOW(), NOW()),
('cat-kaffee', 'Kaffee', 'kaffee', 'Premium Kaffeemaschinen für den perfekten Genuss', '/images/categories/kaffee.jpg', 1, NOW(), NOW()),
('cat-reinigung', 'Reinigung', 'reinigung', 'Effiziente Reinigungsgeräte für Ihr Zuhause', '/images/categories/reinigung.jpg', 2, NOW(), NOW()),
('cat-klima', 'Klima & Luft', 'klima', 'Klimaanlagen und Luftreiniger für jedes Raumklima', '/images/categories/klima.jpg', 3, NOW(), NOW()),
('cat-smart-home', 'Smart Home', 'smart-home', 'Intelligente Geräte für ein vernetztes Zuhause', '/images/categories/smart-home.jpg', 4, NOW(), NOW()),
('cat-haushalt', 'Haushaltsgeräte', 'haushaltsgeraete', 'Waschmaschinen, Trockner, Kühlschränke & mehr', '/images/categories/haushaltsgeraete.jpg', 5, NOW(), NOW());

-- 4. Brands
INSERT INTO "Brand" ("id", "name", "slug", "logo", "createdAt", "updatedAt") VALUES
('br-miele', 'Miele', 'miele', '/images/brands/miele.svg', NOW(), NOW()),
('br-bosch', 'Bosch', 'bosch', '/images/brands/bosch.svg', NOW(), NOW()),
('br-siemens', 'Siemens', 'siemens', '/images/brands/siemens.svg', NOW(), NOW()),
('br-dyson', 'Dyson', 'dyson', '/images/brands/dyson.svg', NOW(), NOW()),
('br-samsung', 'Samsung', 'samsung', '/images/brands/samsung.svg', NOW(), NOW()),
('br-lg', 'LG', 'lg', '/images/brands/lg.svg', NOW(), NOW()),
('br-philips', 'Philips', 'philips', '/images/brands/philips.svg', NOW(), NOW()),
('br-delonghi', 'De''Longhi', 'delonghi', '/images/brands/delonghi.svg', NOW(), NOW()),
('br-jura', 'Jura', 'jura', '/images/brands/jura.svg', NOW(), NOW()),
('br-kitchenaid', 'KitchenAid', 'kitchenaid', '/images/brands/kitchenaid.svg', NOW(), NOW()),
('br-nespresso', 'Nespresso', 'nespresso', '/images/brands/nespresso.svg', NOW(), NOW()),
('br-irobot', 'iRobot', 'irobot', '/images/brands/irobot.svg', NOW(), NOW()),
('br-tado', 'tado°', 'tado', '/images/brands/tado.svg', NOW(), NOW()),
('br-vzug', 'V-ZUG', 'vzug', '/images/brands/vzug.svg', NOW(), NOW()),
('br-thermador', 'Thermador', 'thermador', '/images/brands/thermador.svg', NOW(), NOW()),
('br-electrolux', 'Electrolux', 'electrolux', '/images/brands/electrolux.svg', NOW(), NOW()),
('br-aeg', 'AEG', 'aeg', '/images/brands/aeg.svg', NOW(), NOW()),
('br-gaggenau', 'Gaggenau', 'gaggenau', '/images/brands/gaggenau.svg', NOW(), NOW()),
('br-neff', 'Neff', 'neff', '/images/brands/neff.svg', NOW(), NOW()),
('br-haier', 'Haier', 'haier', '/images/brands/haier.svg', NOW(), NOW()),
('br-liebherr', 'Liebherr', 'liebherr', '/images/brands/liebherr.svg', NOW(), NOW()),
('br-tchibo', 'Tchibo', 'tchibo', '/images/brands/tchibo.svg', NOW(), NOW()),
('br-vorwerk', 'Vorwerk', 'vorwerk', '/images/brands/vorwerk.svg', NOW(), NOW()),
('br-melitta', 'Melitta', 'melitta', '/images/brands/melitta.svg', NOW(), NOW()),
('br-breville', 'Breville', 'breville', '/images/brands/breville.svg', NOW(), NOW()),
('br-kaercher', 'Kärcher', 'kaercher', '/images/brands/kaercher.svg', NOW(), NOW()),
('br-stadler', 'Stadler Form', 'stadler-form', '/images/brands/stadler-form.svg', NOW(), NOW()),
('br-blueair', 'Blueair', 'blueair', '/images/brands/blueair.svg', NOW(), NOW()),
('br-nanoleaf', 'Nanoleaf', 'nanoleaf', '/images/brands/nanoleaf.svg', NOW(), NOW()),
('br-ring', 'Ring', 'ring', '/images/brands/ring.svg', NOW(), NOW());

-- 5. Products
INSERT INTO "Product" ("id", "name", "slug", "description", "shortDesc", "price", "originalPrice", "sku", "inStock", "isFeatured", "isNew", "isPromo", "rating", "reviewCount", "features", "tags", "seoTitle", "seoDesc", "categoryId", "brandId", "weight", "createdAt", "updatedAt") VALUES
('prod-001', 'Thermomix TM7', 'thermomix-tm7', 'Der neue Thermomix TM7 - noch leistungsstärker, vielseitiger und benutzerfreundlicher. Über 80 Kochfunktionen in einem Gerät.', 'Das ultimative Küchengerät mit 80+ Funktionen', 1499.00, 1599.00, 'TM7-2026', true, true, true, false, 4.9, 127, ARRAY['80+ Kochfunktionen', '6,8 Zoll TFT-Display', 'WLAN & App-Steuerung', 'Selbstreinigung'], ARRAY['bestseller', 'premium', 'smart-home'], 'Thermomix TM7 kaufen – HAUSAURA', 'Der neue Thermomix TM7 mit 80+ Funktionen. Kostenloser Versand ab 50€.', 'cat-kueche', 'br-vorwerk', 7.95, NOW(), NOW()),
('prod-002', 'Thermomix TM6', 'thermomix-tm6', 'Der bewährte Thermomix TM6 - zuverlässig, leistungsstark und vielseitig.', 'Bewährte Qualität mit 40+ Funktionen', 1399.00, NULL, 'TM6-2025', true, true, false, false, 4.8, 342, ARRAY['40+ Kochfunktionen', 'Cookidoo-Zugang', 'Selbstreinigung', '5,5 Zoll Display'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kueche', 'br-vorwerk', 7.95, NOW(), NOW()),
('prod-003', 'KitchenAid Artisan Küchenmaschine 5KSM175PSE', 'kitchenaid-artisan-5ksm175pse', 'Die KitchenAid Artisan Küchenmaschine - ikonisches Design trifft auf professionelle Leistung.', 'Ikonische Küchenmaschine mit 4,8L Schüssel', 549.00, 599.00, 'KA-ART-5KSM', true, true, false, true, 4.8, 289, ARRAY['4,8L Edelstahlschüssel', '10 Geschwindigkeiten', 'Planetarische Bewegung'], ARRAY['bestseller', 'design-klassiker'], NULL, NULL, 'cat-kueche', 'br-kitchenaid', 10.5, NOW(), NOW()),
('prod-004', 'Bosch Serie 6 Freistehender Herd HKH634ES5', 'bosch-serie-6-herd-hkh634es5', 'Der Bosch Serie 6 Herd mit 4 Induktionsherdfeldern und 66L Backofen.', 'Induktionsherd mit PerfectBake Technologie', 1899.00, NULL, 'BSH-HKH634ES5', true, false, false, false, 4.7, 78, ARRAY['4 Induktionsherdfelder', '66L Backofen', 'PerfectBake', 'PerfectRoast'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kueche', 'br-bosch', 62, NOW(), NOW()),
('prod-005', 'Siemens iQ700 Backofen HB778GES0', 'siemens-iq700-backofen-hb778ges0', 'Der Siemens iQ700 Einbau-Backofen mit pyrolytischer Selbstreinigung.', 'Einbau-Backofen mit Pyrolyse', 1299.00, NULL, 'SI-HB778GES0', true, false, true, false, 4.8, 45, ARRAY['Pyrolytische Selbstreinigung', 'cookControl Pro', 'TFT-Touchdisplay'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kueche', 'br-siemens', 38, NOW(), NOW()),
('prod-006', 'Gaggenau Vario 200 induktion Kochfeld', 'gaggenau-vario-200-induktion', 'Das Gaggenau Vario 200 Kochfeld - flexibles Induktionssystem.', 'Premium-Induktion mit flexibler Kochfläche', 2499.00, NULL, 'GAG-V200-IND', true, false, false, false, 4.9, 34, ARRAY['2200 cm² Kochfläche', 'Boost-Funktion', 'Bratensensor'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kueche', 'br-gaggenau', NULL, NOW(), NOW()),
('prod-007', 'Jura E8 Platinum', 'jura-e8-platinum', 'Die Jura E8 - Vollautomatischer Kaffeevollautomat der Extraklasse.', 'Premium Kaffeevollautomat mit P.E.P. Technologie', 1199.00, 1299.00, 'JURA-E8-PL', true, true, false, true, 4.8, 156, ARRAY['P.E.P. Technologie', 'Fine Foam Frother', 'Aroma-3-Mahlwerk', 'J.O.E. App'], ARRAY['bestseller', 'premium'], NULL, NULL, 'cat-kaffee', 'br-jura', 9.6, NOW(), NOW()),
('prod-008', 'Jura Z10 Platinum', 'jura-z10-platinum', 'Die Jura Z10 - Das Flaggschiff unter den Vollautomaten.', 'Top-Vollautomat mit Cold Brew & 32 Spezialitäten', 2199.00, NULL, 'JURA-Z10-PL', true, true, true, false, 4.9, 67, ARRAY['Cold Brew Extraction', '32 Spezialitäten', 'P.E.P.'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kaffee', 'br-jura', 12.3, NOW(), NOW()),
('prod-009', 'De''Longhi Magnifica S ECAM 22.110.B', 'delonghi-magnifica-s-ecam22110b', 'Die De''Longhi Magnifica S - kompakter Vollautomat mit integriertem Mahlwerk.', 'Kompakter Vollautomat für den Einstieg', 349.00, NULL, 'DEL-ECAM22110B', true, false, false, false, 4.5, 892, ARRAY['Integriertes Mahlwerk', 'Cappuccino-System', '13 Mahlstufen'], ARRAY['bestseller', 'einstieg'], NULL, NULL, 'cat-kaffee', 'br-delonghi', 9.0, NOW(), NOW()),
('prod-010', 'Nespresso Vertuo Pop+', 'nespresso-vertuo-pop-plus', 'Die Nespresso Vertuo Pop+ - kompakter Kapselmaschine mit Centrifusion-Technologie.', 'Kompakte Kapselmaschine mit 5 Tassengrößen', 99.00, NULL, 'NES-VPOP-PLUS', true, false, true, false, 4.3, 234, ARRAY['Centrifusion-Technologie', '5 Tassengrößen', 'Bluetooth'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kaffee', 'br-nespresso', 3.5, NOW(), NOW()),
('prod-011', 'Melitta Purista Aromatica Pure Black', 'melitta-purista-pure-black', 'Die Melitta Purista - minimalistischer Filterkaffeebereiter.', 'Minimalistischer Filterkaffee-Automat', 249.00, NULL, 'MEL-PURISTA', true, false, false, false, 4.6, 445, ARRAY['Aromaperforation', '3 Tassen', 'Schmorröster-Technik'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kaffee', 'br-melitta', NULL, NOW(), NOW()),
('prod-012', 'Breville Barista Express Impress', 'breville-barista-express-impress', 'Die Breville Barista Express Impress - Halbautomatischer Espressomaschine.', 'Halbautomat mit Mahlwerk & Impression Dosing', 699.00, NULL, 'BREV-BEI', true, false, false, false, 4.7, 156, ARRAY['Integriertes Mahlwerk', 'Impression Dosing', 'ThermoJet'], ARRAY[]::TEXT[], NULL, NULL, 'cat-kaffee', 'br-breville', 11.5, NOW(), NOW()),
('prod-013', 'Dyson V15 Detect Absolute', 'dyson-v15-detect-absolute', 'Der Dyson V15 Detect Absolute - der leistungsstärkste kabellose Staubsauger.', 'Kabelloser Staubsauger mit Laser-Technologie', 749.00, NULL, 'DY-V15-ABS', true, true, true, false, 4.7, 89, ARRAY['Grüne Laserdiode', 'LCD-Display', '60 Min. Laufzeit', 'Piezo-Sensor'], ARRAY['bestseller', 'premium'], NULL, NULL, 'cat-reinigung', 'br-dyson', 3.1, NOW(), NOW()),
('prod-014', 'Dyson Gen5detect Absolute', 'dyson-gen5detect-absolute', 'Der Dyson Gen5detect Absolute - die nächste Generation der Saugroboter.', 'Top Saugleistung mit 280 AW', 949.00, NULL, 'DY-GEN5-ABS', true, false, false, false, 4.8, 45, ARRAY['280 AW Saugleistung', '70 Min. Laufzeit', 'DLS Technologie', 'HEPA-Filter'], ARRAY[]::TEXT[], NULL, NULL, 'cat-reinigung', 'br-dyson', 3.5, NOW(), NOW()),
('prod-015', 'iRobot Roomba j7+', 'irobot-roomba-j7-plus', 'Der iRobot Roomba j7+ - intelligenter Saugroboter mit PrecisionVision Navigation.', 'Intelligenter Saugroboter mit Hinderniserkennung', 599.00, 799.00, 'IR-J7PLUS', true, true, false, true, 4.6, 312, ARRAY['PrecisionVision', 'Auto-Entsorgung', '3-Stufen-Reinigung'], ARRAY['bestseller'], NULL, NULL, 'cat-reinigung', 'br-irobot', 3.4, NOW(), NOW()),
('prod-016', 'Dyson Big Ball Animal Pro', 'dyson-big-ball-animal-pro', 'Der Dyson Big Ball Animal Pro - leistungsstarker Staubsauger für Tierhalter.', 'Kabellöser Staubsauger für Tierhalter', 549.00, NULL, 'DY-BBAP', true, false, false, false, 4.5, 187, ARRAY['Radial Root Cyclone', 'Automatische Höhenanpassung'], ARRAY[]::TEXT[], NULL, NULL, 'cat-reinigung', 'br-dyson', 7.2, NOW(), NOW()),
('prod-017', 'Kärcher SC 4 EasyFix Premium', 'kaercher-sc4-easyfix-premium', 'Der Kärcher SC 4 EasyFix Premium - dampfreiniger mit Geschirrspültank.', 'Dampfreiniger mit Geschirrspültank', 229.00, NULL, 'KA-SC4-EFP', true, false, false, false, 4.7, 567, ARRAY['EasyFix Bodenpark', 'Geschirrspültank', 'Dauerdampf'], ARRAY[]::TEXT[], NULL, NULL, 'cat-reinigung', 'br-kaercher', 6.0, NOW(), NOW()),
('prod-018', 'Dyson Purifier Big Quiet Formaldehyde', 'dyson-purifier-big-quiet', 'Der Dyson Purifier Big Quiet - Luftreiniger und Heizstrahler in einem.', 'Luftreiniger mit formaldehydzerstörendem Katalysator', 899.00, NULL, 'DY-PUR-BQF', true, true, false, false, 4.7, 67, ARRAY['Formaldehyd-Katalysator', 'HEPA H13', 'Bidirektional'], ARRAY['premium', 'gesundheit'], NULL, NULL, 'cat-klima', 'br-dyson', 8.5, NOW(), NOW()),
('prod-019', 'Dyson Pure Cool TP09', 'dyson-pure-cool-tp09', 'Der Dyson Pure Cool TP09 - Luftreiniger und Ventilator.', 'Luftreiniger & Ventilator mit Air-Quality-Display', 499.00, 549.00, 'DY-TP09', true, false, false, true, 4.6, 123, ARRAY['Formaldehyd-Katalysator', 'Air-Quality-Display', '350° Oscillation'], ARRAY[]::TEXT[], NULL, NULL, 'cat-klima', 'br-dyson', NULL, NOW(), NOW()),
('prod-020', 'Stadler Form Oskar Big', 'stadler-form-oskar-big', 'Der Stadler Form Oskar Big - eleganter Luftbefeuchter für Räume bis 80 m².', 'Eleganter Luftbefeuchter für bis 80 m²', 189.00, NULL, 'SF-OSKAR-BIG', true, false, false, false, 4.4, 234, ARRAY['3 Befeuchtungsstufen', 'Hygiene-Funktion', 'Nachtschaltfunktion'], ARRAY[]::TEXT[], NULL, NULL, 'cat-klima', 'br-stadler', NULL, NOW(), NOW()),
('prod-021', 'Blueair Blue 3210', 'blueair-blue-3210', 'Der Blueair Blue 3210 - kompakter Luftreiniger mit HEPASilent-Technologie.', 'Kompakter Luftreiniger mit HEPASilent', 199.00, NULL, 'BLUE-3210', true, false, false, false, 4.5, 189, ARRAY['HEPASilent-Technologie', 'One-Touch-Bedienung', '3 Geschwindigkeiten'], ARRAY[]::TEXT[], NULL, NULL, 'cat-klima', 'br-blueair', NULL, NOW(), NOW()),
('prod-022', 'tado° Smart Thermostat Starter Kit V3+', 'tado-smart-thermostat-v3plus', 'Das tado° Smart Thermostat V3+ Starter Kit - intelligente Heizungssteuerung.', 'Intelligente Heizungssteuerung mit bis zu 30% Ersparnis', 149.00, 199.00, 'TADO-V3PLUS-SK', true, true, false, true, 4.6, 1234, ARRAY['Geofencing', 'Energiebericht', 'Sprachsteuerung', 'Multi-Zone'], ARRAY['bestseller', 'smart-home', 'energieeffizient'], NULL, NULL, 'cat-smart-home', 'br-tado', NULL, NOW(), NOW()),
('prod-023', 'tado° Smart AC Control V3+', 'tado-smart-ac-control-v3plus', 'Das tado° Smart AC Control V3+ - intelligente Steuerung für Klimaanlagen.', 'Smart AC Controller für Klimaanlagen', 99.00, NULL, 'TADO-ACV3', true, false, false, false, 4.5, 567, ARRAY['IR-Fernbedienung', 'Sprachsteuerung', 'Off-Away'], ARRAY[]::TEXT[], NULL, NULL, 'cat-smart-home', 'br-tado', NULL, NOW(), NOW()),
('prod-024', 'Philips Hue Starter Kit E27', 'philips-hue-starter-kit-e27', 'Das Philips Hue Starter Kit mit Bridge und 3 E27 White & Color Ambiance.', 'Starter Kit mit Bridge & 3 Farb-LEDs', 149.00, 179.00, 'PH-HUE-SK-E27', true, false, false, false, 4.7, 2345, ARRAY['16 Millionen Farben', 'Bridge inklusive', 'Sprachsteuerung'], ARRAY['bestseller'], NULL, NULL, 'cat-smart-home', 'br-philips', NULL, NOW(), NOW()),
('prod-025', 'Nanoleaf Shapes Hexagons Starter Kit', 'nanoleaf-shapes-hexagons', 'Die Nanoleaf Shapes Hexagons - modulare LED-Panele für kreative Wandgestaltung.', 'Modulare LED-Panele mit Touch & Musik-Sync', 199.00, NULL, 'NANO-SH-HEX', true, false, false, false, 4.4, 345, ARRAY['Touch-Reaktiv', 'Musik-Sync', '16M Farben', 'HomeKit & Matter'], ARRAY[]::TEXT[], NULL, NULL, 'cat-smart-home', 'br-nanoleaf', NULL, NOW(), NOW()),
('prod-026', 'Ring Video Doorbell 4', 'ring-video-doorbell-4', 'Die Ring Video Doorbell 4 - smartes Türklingelsystem mit Video.', 'Smartes Türklingelsystem mit Video', 199.00, NULL, 'RING-VDB4', true, false, false, false, 4.5, 1234, ARRAY['1080p HD Video', 'Farbvideo bei Nacht', 'Bewegungserkennung'], ARRAY[]::TEXT[], NULL, NULL, 'cat-smart-home', 'br-ring', NULL, NOW(), NOW()),
('prod-027', 'Miele W1 Waschmaschine WCI870 WCS', 'miele-w1-waschmaschine-wci870', 'Die Miele W1 Frontlader-Waschmaschine - revolutionäre Pflege mit TwinDos.', 'Premium Waschmaschine mit TwinDos Technologie', 1899.00, NULL, 'MIELE-WCI870', true, true, false, false, 4.9, 203, ARRAY['TwinDos', 'CapDosing', 'PowerWash 2.0', '8 kg Füllmenge'], ARRAY['premium', 'energieeffizient'], NULL, NULL, 'cat-haushalt', 'br-miele', 87, NOW(), NOW()),
('prod-028', 'Miele T1 Trommeltrockner TRK845 WP', 'miele-t1-trockner-trk845', 'Der Miele T1 Trommeltrockner mit Wärmepumpentechnologie.', 'Premium Trommeltrockner mit Wärmepumpe', 1699.00, NULL, 'MIELE-TRK845', true, false, false, false, 4.8, 156, ARRAY['Wärmepumpe', 'AutoSensoren', 'PerfectDry', '8 kg'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-miele', 62, NOW(), NOW()),
('prod-029', 'Bosch Serie 6 Waschmaschine WGG244Z00', 'bosch-serie-6-wgg244z00', 'Die Bosch Serie 6 Waschmaschine mit Home Connect, i-DOS und ActiveWater Plus.', 'Waschmaschine mit i-DOS & Home Connect', 899.00, NULL, 'BSH-WGG244Z00', true, false, false, false, 4.7, 312, ARRAY['i-DOS', 'Home Connect', 'ActiveWater Plus', '9 kg'], ARRAY['bestseller'], NULL, NULL, 'cat-haushalt', 'br-bosch', 74, NOW(), NOW()),
('prod-030', 'Samsung EcoBubble WW90TP04DSH', 'samsung-ecobubble-ww90tp04dsh', 'Die Samsung EcoBubble Waschmaschine mit AirWash-Technologie.', 'EcoBubble mit AirWash-Technologie', 699.00, 799.00, 'SAM-WW90TP', true, false, false, true, 4.6, 567, ARRAY['EcoBubble', 'AirWash', 'Digital Inverter', 'Smart Things'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-samsung', 65, NOW(), NOW()),
('prod-031', 'AEG LR7A80600 Frontlader', 'aeg-lr7a80600', 'Die AEG LR7A80600 Waschmaschine mit ProSense Technology.', 'ProSense Waschmaschine mit Öko-Inverter', 799.00, NULL, 'AEG-LR7A80600', true, false, false, false, 4.7, 234, ARRAY['ProSense Technology', 'Öko-Inverter', 'Antivibrations-Design'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-aeg', 70, NOW(), NOW()),
('prod-032', 'Miele G7966 SCVi AutoDos', 'miele-g7966-scvi-autodos', 'Der Miele G7966 SCVi - Einbaugeschirrspüler mit AutoDos und PowerDisk.', 'Premium-Geschirrspüler mit AutoDos & PowerDisk', 1699.00, NULL, 'MIELE-G7966', true, true, false, false, 4.9, 89, ARRAY['AutoDos', 'PowerDisk', '3D-Tac Sensor', 'WiFiConn@ct'], ARRAY['premium', 'energieeffizient'], NULL, NULL, 'cat-haushalt', 'br-miele', 38, NOW(), NOW()),
('prod-033', 'Bosch Serie 6 SMV88TX36E', 'bosch-serie-6-smv88tx36e', 'Der Bosch Serie 6 Einbau-Geschirrspüler mit Zeolith-Trocknung.', 'Geschirrspüler mit Zeolith & CrystalDry', 1199.00, NULL, 'BSH-SMV88TX36E', true, false, false, false, 4.8, 234, ARRAY['Zeolith-Trocknung', 'CrystalDry', 'Home Connect'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-bosch', 36, NOW(), NOW()),
('prod-034', 'Siemens iQ700 SN878X04CE', 'siemens-iq700-sn878x04ce', 'Der Siemens iQ700 Geschirrspüler mit varioDrawer Plus und Zeolith.', 'Siemens iQ700 mit varioDrawer & Zeolith', 1099.00, NULL, 'SI-SN878X04CE', true, false, false, false, 4.7, 178, ARRAY['varioDrawer Plus', 'Zeolith Trocknung', 'Home Connect'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-siemens', 35, NOW(), NOW()),
('prod-035', 'Bosch Serie 2 SKS62E32EU', 'bosch-serie-2-sks62e32eu', 'Der Bosch Serie 2 Kompakt-Geschirrspüler für die Aufstellschublade.', 'Kompakt-Geschirrspüler für die Aufstellschublade', 449.00, NULL, 'BSH-SKS62E32EU', true, false, false, false, 4.5, 456, ARRAY['Aufbau-Geschirrspüler', '10 Gedecke', '6 Programme', 'AquaStop'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-bosch', 25, NOW(), NOW()),
('prod-036', 'Liebherr Premium Comfort Kgn 36vi3', 'liebherr-premium-comfort-kgn36vi3', 'Der Liebherr Premium Comfort Kühlschrank - BioFresh, NoFrost und MagicEye.', 'Premium Kühlschrank mit BioFresh & NoFrost', 1499.00, NULL, 'LB-KGN36VI3', true, false, false, false, 4.8, 134, ARRAY['BioFresh', 'NoFrost', 'MagicEye', 'SuperCool'], ARRAY['premium', 'energieeffizient'], NULL, NULL, 'cat-haushalt', 'br-liebherr', 93, NOW(), NOW()),
('prod-037', 'Liebherr Mono SGNe 5226 Gefrierschrank', 'liebherr-mono-sgne5226', 'Der Liebherr Mono Gefrierschrank mit NoFrost, SmartFrost und VarioSpace.', 'Gefrierschrank mit NoFrost & VarioSpace', 1299.00, NULL, 'LB-SGNE5226', true, false, false, false, 4.7, 89, ARRAY['NoFrost', 'SmartFrost', 'VarioSpace'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-liebherr', 85, NOW(), NOW()),
('prod-038', 'Samsung Family Hub Bespoke RB38B7735S9', 'samsung-family-hub-bespoke-rb38b7735s9', 'Der Samsung Family Hub Kühlschrank mit 21,5 Zoll Touchscreen und AI-Kamera.', 'Family Hub mit Touchscreen & AI-Kamera', 2499.00, NULL, 'SAM-FH-RB38B', true, false, true, false, 4.6, 67, ARRAY['21,5" Touchscreen', 'AI-Innenraumkamera', 'SmartThings'], ARRAY['premium', 'smart-home'], NULL, NULL, 'cat-haushalt', 'br-samsung', 115, NOW(), NOW()),
('prod-039', 'Bosch Serie 6 KGN39VL3A', 'bosch-serie-6-kgn39vl3a', 'Der Bosch Serie 6 Kühlschrank mit NoFrost und VitaFresh Pro.', 'NoFrost Kühlschrank mit VitaFresh Pro', 1099.00, NULL, 'BSH-KGN39VL3A', true, false, false, false, 4.7, 234, ARRAY['NoFrost', 'VitaFresh Pro', 'Home Connect', 'MultiAirflow'], ARRAY[]::TEXT[], NULL, NULL, 'cat-haushalt', 'br-bosch', 82, NOW(), NOW());

-- 6. Product Images
INSERT INTO "ProductImage" ("id", "url", "alt", "position", "productId")
SELECT 'img-' || p."id", '/images/products/' || p."slug" || '.jpg', p."slug", 0, p."id"
FROM "Product" p;

-- 7. Product Specs
INSERT INTO "ProductSpec" ("id", "key", "value", "position", "productId") VALUES
('spec-001', 'Leistung', '1500 Watt', 0, 'prod-001'),
('spec-002', 'Gewicht', '7,95 kg', 1, 'prod-001'),
('spec-003', 'Fassungsvermögen', '2,2 Liter', 2, 'prod-001'),
('spec-004', 'Kochfunktionen', '80+', 3, 'prod-001'),
('spec-005', 'Leistung', '1500 Watt', 0, 'prod-002'),
('spec-006', 'Gewicht', '7,95 kg', 1, 'prod-002'),
('spec-007', 'Fassungsvermögen', '2,2 Liter', 2, 'prod-002'),
('spec-008', 'Kochfunktionen', '40+', 3, 'prod-002'),
('spec-009', 'Leistung', '300 Watt', 0, 'prod-003'),
('spec-010', 'Schüsselvolumen', '4,8 Liter', 1, 'prod-003'),
('spec-011', 'Gewicht', '10,5 kg', 2, 'prod-003'),
('spec-012', 'Geschwindigkeiten', '10', 3, 'prod-003'),
('spec-013', 'Herdtyp', 'Induktion', 0, 'prod-004'),
('spec-014', 'Backofenvolumen', '66 Liter', 1, 'prod-004'),
('spec-015', 'Backraumvolumen', '71 Liter', 0, 'prod-005'),
('spec-016', 'Heizarten', '13', 1, 'prod-005'),
('spec-017', 'Kochfeldtyp', 'Induktion', 0, 'prod-006'),
('spec-018', 'Fläche', '2200 cm²', 1, 'prod-006'),
('spec-019', 'Bohnschale', 'Integriert, 280g', 0, 'prod-007'),
('spec-020', 'Wassertank', '1,9 Liter', 1, 'prod-007'),
('spec-021', 'Spezialitäten', '32', 0, 'prod-008'),
('spec-022', 'Cold Brew', 'Ja', 1, 'prod-008'),
('spec-023', 'Bohnschale', '250g', 0, 'prod-009'),
('spec-024', 'Wassertank', '1,8 Liter', 1, 'prod-009'),
('spec-025', 'Kapseltyp', 'Vertuo', 0, 'prod-010'),
('spec-026', 'Tassengrößen', '5', 1, 'prod-010'),
('spec-027', 'Kaffeeart', 'Filterkaffee', 0, 'prod-011'),
('spec-028', 'Behältervolumen', '1075ml', 1, 'prod-011'),
('spec-029', 'Brühtyp', 'Espresso', 0, 'prod-012'),
('spec-030', 'Aufheizzeit', '3 Sekunden', 1, 'prod-012'),
('spec-031', 'Laufzeit', 'bis zu 60 Minuten', 0, 'prod-013'),
('spec-032', 'Saugleistung', '230 AW', 1, 'prod-013'),
('spec-033', 'Laufzeit', 'bis zu 70 Minuten', 0, 'prod-014'),
('spec-034', 'Saugleistung', '280 AW', 1, 'prod-014'),
('spec-035', 'Laufzeit', 'bis zu 75 Minuten', 0, 'prod-015'),
('spec-036', 'Navigation', 'PrecisionVision', 1, 'prod-015'),
('spec-037', 'Saugleistung', '250 AW', 0, 'prod-016'),
('spec-038', 'Filter', 'HEPA', 1, 'prod-016'),
('spec-039', 'Dampfdruck', '3,5 bar', 0, 'prod-017'),
('spec-040', 'Heizzeit', '4 Minuten', 1, 'prod-017'),
('spec-041', 'Filter', 'HEPA H13', 0, 'prod-018'),
('spec-042', 'Raumgröße', 'bis 60 m²', 1, 'prod-018'),
('spec-043', 'Filter', 'HEPA H13 + Aktivkohle', 0, 'prod-019'),
('spec-044', 'Raumgröße', 'bis 40 m²', 1, 'prod-019'),
('spec-045', 'Raumgröße', 'bis 80 m²', 0, 'prod-020'),
('spec-046', 'Wasserkapazität', '6 Liter', 1, 'prod-020'),
('spec-047', 'Raumgröße', 'bis 25 m²', 0, 'prod-021'),
('spec-048', 'Filter', 'HEPASilent', 1, 'prod-021'),
('spec-049', 'Kompatibilität', 'Alexa, Google, HomeKit', 0, 'prod-022'),
('spec-050', 'Einsparnis', 'bis 30%', 1, 'prod-022'),
('spec-051', 'Steuerung', 'IR-Signal', 0, 'prod-023'),
('spec-052', 'Kommunikation', 'WLAN', 1, 'prod-023'),
('spec-053', 'Farbtemperatur', '2000-6500K', 0, 'prod-024'),
('spec-054', 'Lebensdauer', '25.000 Stunden', 1, 'prod-024'),
('spec-055', 'Panel-Anzahl', '9 Starter Kit', 0, 'prod-025'),
('spec-056', 'Leuchtdauer', '25.000 Stunden', 1, 'prod-025'),
('spec-057', 'Videoauflösung', '1080p HD', 0, 'prod-026'),
('spec-058', 'Sichtfeld', '160° horizontal', 1, 'prod-026'),
('spec-059', 'Füllmenge', '8 kg', 0, 'prod-027'),
('spec-060', 'Energieeffizienz', 'A+++', 1, 'prod-027'),
('spec-061', 'Fassungsvermögen', '8 kg', 0, 'prod-028'),
('spec-062', 'Trocknungsart', 'Wärmepumpe', 1, 'prod-028'),
('spec-063', 'Füllmenge', '9 kg', 0, 'prod-029'),
('spec-064', 'Energieeffizienz', 'A+++', 1, 'prod-029'),
('spec-065', 'Füllmenge', '9 kg', 0, 'prod-030'),
('spec-066', 'Schleuderdrehzahl', '1400 U/min', 1, 'prod-030'),
('spec-067', 'Füllmenge', '8 kg', 0, 'prod-031'),
('spec-068', 'Energieeffizienz', 'A+++', 1, 'prod-031'),
('spec-069', 'Fassungsvermögen', '16 Gedecke', 0, 'prod-032'),
('spec-070', 'Energieeffizienz', 'A+++', 1, 'prod-032'),
('spec-071', 'Fassungsvermögen', '14 Gedecke', 0, 'prod-033'),
('spec-072', 'Geräuschpegel', '44 dB(A)', 1, 'prod-033'),
('spec-073', 'Fassungsvermögen', '14 Gedecke', 0, 'prod-034'),
('spec-074', 'Trocknung', 'Zeolith', 1, 'prod-034'),
('spec-075', 'Fassungsvermögen', '10 Gedecke', 0, 'prod-035'),
('spec-076', 'Programme', '6 + 3 Spezial', 1, 'prod-035'),
('spec-077', 'Nutzvolumen', '362 Liter', 0, 'prod-036'),
('spec-078', 'Energieeffizienz', 'A+++', 1, 'prod-036'),
('spec-079', 'Nutzvolumen', '382 Liter', 0, 'prod-037'),
('spec-080', 'Energieeffizienz', 'A+++', 1, 'prod-037'),
('spec-081', 'Nutzvolumen', '389 Liter', 0, 'prod-038'),
('spec-082', 'Display', '21,5 Zoll TFT', 1, 'prod-038'),
('spec-083', 'Nutzvolumen', '366 Liter', 0, 'prod-039'),
('spec-084', 'Energieeffizienz', 'A+++', 1, 'prod-039');

-- 8. Sample Reviews
INSERT INTO "Review" ("id", "rating", "title", "content", "authorName", "authorEmail", "isApproved", "productId", "createdAt", "updatedAt") VALUES
('rev-001', 5, 'Absolut top!', 'Super Service und schnell geliefert. Das Gerät funktioniert einwandfrei.', 'Thomas M.', 'thomas@example.de', true, 'prod-001', NOW(), NOW()),
('rev-002', 4, 'Gutes Preis-Leistungs-Verhältnis', 'Bin sehr zufrieden mit dem Kauf. Nur die Lieferung hat etwas länger gedauert.', 'Sandra K.', 'sandra@example.de', true, 'prod-001', NOW(), NOW()),
('rev-003', 5, 'Kann ich nur empfehlen!', 'Top Qualität und tolle Beratung. Gerne wieder.', 'Michael B.', 'michael@example.de', true, 'prod-007', NOW(), NOW()),
('rev-004', 4, 'Sehr gut', 'Das Gerät hält was es verspricht. Ein Stern Abzug wegen der Anleitung.', 'Anna L.', 'anna@example.de', true, 'prod-013', NOW(), NOW()),
('rev-005', 5, 'Perfekt', 'Genau das was ich gesucht habe. Funktioniert hervorragend.', 'Peter H.', 'peter@example.de', true, 'prod-022', NOW(), NOW()),
('rev-006', 3, 'Okay, aber nicht perfekt', 'Funktioniert grundsätzlich gut, aber es gibt ein paar Kleinigkeiten die stören.', 'Julia W.', 'julia@example.de', true, 'prod-003', NOW(), NOW()),
('rev-007', 5, 'Bestes Gerät in seiner Klasse', 'Habe lange verglichen und mich für dieses Gerät entschieden. Keine bereute Entscheidung.', 'Marcus S.', 'marcus@example.de', true, 'prod-027', NOW(), NOW()),
('rev-008', 4, 'Solide Qualität', 'Verarbeitung ist erstklassig. Die Bedienung ist intuitiv.', 'Laura F.', 'laura@example.de', true, 'prod-009', NOW(), NOW());
