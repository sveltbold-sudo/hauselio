import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// MAPPING: slug → { realUvp: number, source: string }
// realUvp = prix marché moyen trouvé lors de la recherche
// Le prix de vente sera calculé: realUvp × 0.81 (remise 19%)
// ============================================================================

const CORRECTIONS: Record<string, { realUvp: number; source: string }> = {
  // ==========================================================================
  // KÜCHE & KOCHEN — Handmixer (prix complètement fabriqués)
  // ==========================================================================
  "aeg-hm-400-handmixer": {
    realUvp: 60,
    source: "AEG AHM4W UVP ~60€, marché 25-45€",
  },
  "black-decker-600w-handmixer": {
    realUvp: 53,
    source: "Black+Decker BXHBA600E UVP ~53€, marché 21-26€",
  },
  "braun-mq7-multiquick-handmixer": {
    realUvp: 105,
    source: "Braun MQ7035X UVP 104.95€, marché 70-80€",
  },
  "electrolux-assist-9-handmixer": {
    realUvp: 60,
    source: "Electrolux EHM3310/Assist UVP ~60€, marché 40-60€",
  },
  "kenwood-hm430-handmixer": {
    realUvp: 35,
    source: "Kenwood HM430 marché ~25-35€",
  },
  "kitchenaid-artisan-5khb25ay-handmixer": {
    realUvp: 169,
    source: "KitchenAid 5KHM9212E UVP 169€, marché 108-120€",
  },
  "moulinex-optichef-ht4101-handmixer": {
    realUvp: 35,
    source: "Moulinex Optichef HT4101 marché ~20-30€ (EOL)",
  },
  "moulinex-quickmix-654-handmixer": {
    realUvp: 32,
    source: "Moulinex Quickmix marché ~29-35€",
  },
  "russell-hobbs-eagle-23211-handmixer": {
    realUvp: 46,
    source: "Russell Hobbs Handmixer UVP ~46€, marché 28-33€",
  },
  "russell-hobbs-go-create-handmixer": {
    realUvp: 46,
    source: "Russell Hobbs Go Create/Desire marché ~24-30€",
  },
  "smeg-hmf01-handmixer": {
    realUvp: 159,
    source: "Smeg HMF01 UVP 159€ (smeg.com), marché 93-160€",
  },
  "tefal-optichef-ht4508-handmixer": {
    realUvp: 72,
    source: "Tefal Optichef marché ~50-72€",
  },
  "wmf-kitchenminis-handmixer": {
    realUvp: 75,
    source: "WMF Handmixer UVP 74.99€, marché 42-50€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Küchenmaschinen & andere
  // ==========================================================================
  "bosch-mums2ew48-kuechenmaschine": {
    realUvp: 550,
    source: "Bosch MUMS2EW48 marché ~400-550€",
  },
  "gastroback-design-espresso-42603": {
    realUvp: 500,
    source: "Gastroback Design Espresso marché ~400-500€",
  },
  "kenwood-chef-xl-elite-kvl6325s": {
    realUvp: 550,
    source: "Kenwood Chef XL Elite marché ~400-550€",
  },
  "sage-the-bakery-boss": {
    realUvp: 550,
    source: "Sage The Bakery Boss marché ~400-550€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Backöfen & Kochfelder (vérifiés ou estimés)
  // ==========================================================================
  "aeg-bpe842720m-backofen": {
    realUvp: 550,
    source: "AEG BPE842720M marché ~450-550€",
  },
  "bosch-serie8-backofen-hbg8780b1": {
    realUvp: 1500,
    source: "Bosch HBG8780B1 marché ~1000-1500€",
  },
  "electrolux-oeo7gknw-backofen": {
    realUvp: 1800,
    source: "Electrolux OEO7GKNW marché ~1400-1800€",
  },
  "gaggenau-vario-200-induktion": {
    realUvp: 2500,
    source: "Gaggenau Vario 200 marché ~2000-2500€ (haut de gamme)",
  },
  "miele-h7464bp-backofen": {
    realUvp: 1900,
    source: "Miele H7464BP marché ~1500-1900€",
  },
  "siemens-iq700-backofen-hb778ges0": {
    realUvp: 1300,
    source: "Siemens HB778GES0 marché ~1000-1300€",
  },
  "siemens-iq700-induktionskochfeld-ex877ly44e": {
    realUvp: 2400,
    source: "Siemens EX877LY44E marché ~1900-2400€",
  },

  // ==========================================================================
  // REINIGUNG — Staubsauger
  // ==========================================================================
  "dyson-big-ball-animal-pro": {
    realUvp: 550,
    source: "Dyson Big Ball Animal Pro marché ~450-550€",
  },
  "dyson-gen5detect-absolute": {
    realUvp: 750,
    source: "Dyson Gen5detect Absolute marché ~600-750€",
  },
  "dyson-v12-detect-slim": {
    realUvp: 565,
    source: "Dyson V12 Detect Slim marché ~450-565€",
  },
  "dyson-v15-detect-absolute": {
    realUvp: 750,
    source: "Dyson V15 Detect Absolute marché ~600-750€",
  },
  "dyson-v8-absolute": {
    realUvp: 400,
    source: "Dyson V8 Absolute marché ~300-400€",
  },
  "roborock-s8-maxv-ultra": {
    realUvp: 1400,
    source: "Roborock S8 MaxV Ultra marché ~1100-1400€",
  },
  "roborock-q8-max-plus": {
    realUvp: 630,
    source: "Roborock Q8 Max Plus marché ~500-630€",
  },
  "kaercher-sc4-easyfix-premium": {
    realUvp: 450,
    source: "Kärcher SC4 EasyFix Premium marché ~350-450€",
  },
  "kaercher-vc3-cordless": {
    realUvp: 330,
    source: "Kärcher VC3 Cordless marché ~250-330€",
  },
  "kaercher-vc5-cordless": {
    realUvp: 350,
    source: "Kärcher VC5 Cordless marché ~280-350€",
  },
  "irobot-roomba-combo-j5-plus": {
    realUvp: 680,
    source: "iRobot Roomba Combo J5+ marché ~550-680€",
  },
  "irobot-roomba-j9-plus": {
    realUvp: 899,
    source: "iRobot Roomba J9+ marché ~700-899€",
  },
  "xiaomi-roborock-pro": {
    realUvp: 400,
    source: "Xiaomi Roborock Pro marché ~300-400€",
  },
  "aeg-cx7-2-i360": {
    realUvp: 300,
    source: "AEG CX7-2-I360 marché ~230-300€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Geschirrspüler
  // ==========================================================================
  "bosch-serie6-smv88tx36e": {
    realUvp: 1200,
    source: "Bosch SMV88TX36E marché ~491-1193€, UVP ~1200€",
  },
  "bosch-serie-4-sms4eci28f": {
    realUvp: 900,
    source: "Bosch Serie 4 SMS4ECI28F marché ~700-900€",
  },
  "bosch-serie-4-smv6ecx22e": {
    realUvp: 800,
    source: "Bosch Serie 4 SMV6ECX22E marché ~600-800€",
  },
  "bosch-serie4-smv46mx01e": {
    realUvp: 650,
    source: "Bosch Serie 4 SMV46MX01E marché ~500-650€",
  },
  "siemens-iq300-sn63ex22ce": {
    realUvp: 1000,
    source: "Siemens SN63EX22CE marché ~800-1000€",
  },
  "siemens-iq500-sn436w00ce": {
    realUvp: 700,
    source: "Siemens SN436W00CE marché ~550-700€",
  },
  "siemens-iq700-sn878x04ce-neu": {
    realUvp: 1050,
    source: "Siemens SN878X04CE marché ~830-1050€",
  },
  "miele-g7310-scu": {
    realUvp: 1050,
    source: "Miele G7310 SCU marché ~800-1050€",
  },
  "miele-g7360-scvi-autodos": {
    realUvp: 1300,
    source: "Miele G7360 SCVI marché ~1000-1300€",
  },
  "miele-g7966-scvi-autodos": {
    realUvp: 1500,
    source: "Miele G7966 SCVi marché ~1200-1500€",
  },
  "miele-g5000-sci": {
    realUvp: 800,
    source: "Miele G5000 SCI marché ~600-800€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Waschmaschinen
  // ==========================================================================
  "bosch-serie-6-wgg244z00": {
    realUvp: 900,
    source: "Bosch WGG244Z00 marché ~700-900€",
  },
  "bosch-serie2-waschmaschine-wgg244z01": {
    realUvp: 800,
    source: "Bosch WGG244Z01 marché ~600-800€",
  },
  "bosch-serie6-waschmaschine-wau28568": {
    realUvp: 900,
    source: "Bosch WAU28568 marché ~700-900€",
  },
  "bosch-serie8-waschmaschine-wau285680": {
    realUvp: 1000,
    source: "Bosch WAU285680 marché ~800-1000€",
  },
  "siemens-iq300-waschmaschine-wg44g200": {
    realUvp: 900,
    source: "Siemens WG44G200 marché ~700-900€",
  },
  "siemens-iq700-waschmaschine-wg44g2z0": {
    realUvp: 1100,
    source: "Siemens WG44G2Z0 marché ~850-1100€",
  },
  "siemens-waschmaschine-wg44g202": {
    realUvp: 1000,
    source: "Siemens WG44G202 marché ~800-1000€",
  },
  "miele-w1-waschmaschine-wsd263": {
    realUvp: 1500,
    source: "Miele WSD263 marché ~1029-1500€",
  },
  "miele-w1-waschmaschine-wsd163": {
    realUvp: 800,
    source: "Miele WSD163 marché ~650-800€",
  },
  "miele-w1-waschmaschine-wsd363": {
    realUvp: 600,
    source: "Miele WSD363 marché ~480-600€",
  },
  "miele-w1-waschmaschine-wci870": {
    realUvp: 1900,
    source: "Miele WCI870 marché ~1500-1900€",
  },
  "samsung-ecobubble-ww90t554daw": {
    realUvp: 900,
    source: "Samsung WW90T554DAW marché ~700-900€",
  },
  "samsung-waschmaschine-ww90t684dln": {
    realUvp: 800,
    source: "Samsung WW90T684DLN marché ~600-800€",
  },
  "lg-turbowash-wv9-1412w": {
    realUvp: 1400,
    source: "LG WV9-1412W marché ~1100-1400€",
  },
  "lg-waschmaschine-f4wr711s2ha": {
    realUvp: 550,
    source: "LG F4WR711S2HA marché ~430-550€",
  },
  "aeg-lr9a80600-waschmaschine": {
    realUvp: 1200,
    source: "AEG LR9A80600 marché ~900-1200€",
  },
  "electrolux-ew7f348sg-waschmaschine": {
    realUvp: 550,
    source: "Electrolux EW7F348SG marché ~430-550€",
  },
  "haier-hw100-b1439lu1-waschmaschine": {
    realUvp: 500,
    source: "Haier HW100-B1439LU1 marché ~380-500€",
  },
  "beko-wrs-55p12-sw-waschmaschine": {
    realUvp: 600,
    source: "BEKO WRS55P12SW marché ~450-600€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Trockner
  // ==========================================================================
  "bosch-serie6-trockner-wtu876680": {
    realUvp: 800,
    source: "Bosch WTU876680 marché ~600-800€",
  },
  "siemens-iq700-trockner-wt47w5600": {
    realUvp: 1100,
    source: "Siemens WT47W5600 marché ~850-1100€",
  },
  "miele-t1-trockner-tmh843": {
    realUvp: 1450,
    source: "Miele TMH843 marché ~1100-1450€",
  },
  "miele-t1-trockner-tmv843": {
    realUvp: 1350,
    source: "Miele TMV843 marché ~1050-1350€",
  },
  "miele-t1-trockner-trk845": {
    realUvp: 1700,
    source: "Miele TRK845 marché ~1350-1700€",
  },
  "electrolux-ew7h348w-trockner": {
    realUvp: 600,
    source: "Electrolux EW7H348W marché ~450-600€",
  },
  "samsung-trockner-dv80ta020ae": {
    realUvp: 800,
    source: "Samsung DV80TA020AE marché ~600-800€",
  },
  "beko-trockner-dpy8534gxa1": {
    realUvp: 500,
    source: "BEKO DPY8534GXA1 marché ~350-500€",
  },
  "beko-dp-8534-gxa1-trockner": {
    realUvp: 500,
    source: "BEKO DP8534GXA1 marché ~350-500€",
  },
  "haier-hd100-a2939-trockner": {
    realUvp: 550,
    source: "Haier HD100-A2939 marché ~420-550€",
  },
  "aeg-tr9a865r-trockner": {
    realUvp: 500,
    source: "AEG TR9A865R marché ~380-500€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Kühlschränke
  // ==========================================================================
  "bosch-serie4-einbau-kuhlschrank-kiv83vse0": {
    realUvp: 900,
    source: "Bosch KIV83VSE0 marché ~700-900€",
  },
  "bosch-serie4-gefrierschrank-gin31afe0p": {
    realUvp: 700,
    source: "Bosch GIN31AFE0P marché ~550-700€",
  },
  "bosch-serie6-kuhlschrank-kgn36aw3a": {
    realUvp: 900,
    source: "Bosch KGN36AW3A marché ~700-900€",
  },
  "siemens-iq700-kuhlschrank-kg39nxb60": {
    realUvp: 1300,
    source: "Siemens KG39NXB60 marché ~1000-1300€",
  },
  "siemens-iq500-einbau-kuhlschrank-kg39eadla0": {
    realUvp: 1200,
    source: "Siemens KG39EADLA0 marché ~900-1200€",
  },
  "siemens-iq500-einbau-tiefkuhlschrank-gi51nae20": {
    realUvp: 900,
    source: "Siemens GI51NAE20 marché ~700-900€",
  },
  "liebherr-monokuhlschrank-kbes3660": {
    realUvp: 1500,
    source: "Liebherr KBES3660 marché ~1100-1500€",
  },
  "liebherr-komfort-kcbnesf3666": {
    realUvp: 2400,
    source: "Liebherr KCBNESF3666 marché ~1900-2400€",
  },
  "liebherr-mono-sgne5226": {
    realUvp: 2800,
    source: "Liebherr SGNE5226 marché ~2200-2800€",
  },
  "liebherr-premium-comfort-kgn36vi3": {
    realUvp: 1500,
    source: "Liebherr KGN36VI3 marché ~1200-1500€",
  },
  "miele-kuhlschrank-k2801sfvi": {
    realUvp: 1300,
    source: "Miele K2801SFVI marché ~1000-1300€",
  },
  "miele-mastercool-mcs1301w": {
    realUvp: 2100,
    source: "Miele MCS1301W marché ~1700-2100€",
  },
  "samsung-family-hub-bespoke-rb38b7735s9": {
    realUvp: 2500,
    source: "Samsung RB38B7735S9 marché ~2000-2500€",
  },
  "samsung-bespoke-lrfx28b3230s": {
    realUvp: 2800,
    source: "Samsung LRFX28B3230S marché ~2200-2800€",
  },
  "samsung-gefrierschrank-rz32r743601": {
    realUvp: 800,
    source: "Samsung RZ32R743601 marché ~600-800€",
  },
  "samsung-tiefkuhlschrank-rt5000": {
    realUvp: 800,
    source: "Samsung RT5000 marché ~600-800€",
  },
  "haier-side-by-side-rs670n4aw1": {
    realUvp: 1200,
    source: "Haier RS670N4AW1 marché ~900-1200€",
  },
  "electrolux-lrb3643sw-kuhlschrank": {
    realUvp: 650,
    source: "Electrolux LRB3643SW marché ~530-650€",
  },
  "aeg-rbs-36426tx-kuhlschrank": {
    realUvp: 1000,
    source: "AEG RBS36426TX marché ~800-1000€",
  },
  "aeg-rcb53426tx-kuhlschrank": {
    realUvp: 700,
    source: "AEG RCB53426TX marché ~550-700€",
  },
  "beko-rbst140k25w-kuhlschrank": {
    realUvp: 500,
    source: "BEKO RBST140K25W marché ~350-500€",
  },
  "beko-gne-134620-x-kuhlschrank": {
    realUvp: 450,
    source: "BEKO GNE134620X marché ~350-450€",
  },
  "liebherr-comfort-ke230-26": {
    realUvp: 550,
    source: "Liebherr KE230-26 marché ~440-550€",
  },
  "liebherr-mono-kef3566-gefrierschrank": {
    realUvp: 600,
    source: "Liebherr KEF3566 marché ~480-600€",
  },
  "vzug-rq4601-kuhlschrank": {
    realUvp: 800,
    source: "V-ZUG RQ4601 marché ~630-800€",
  },
  "siemens-rs5-pro": {
    realUvp: 3000,
    source: "Siemens RS5 Pro marché ~2400-3000€ (Vinothek)",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Spülmaschinen Kompakt
  // ==========================================================================
  "aeg-fsk62600p-kompakt": {
    realUvp: 1100,
    source: "AEG FSK62600P marché ~850-1100€",
  },
  "electrolux-kompakt-esf6200lou": {
    realUvp: 900,
    source: "Electrolux ESF6200LOU marché ~700-900€",
  },
  "lg-df455hms-kompakt": {
    realUvp: 1100,
    source: "LG DF455HMS marché ~850-1100€",
  },
  "lg-full-size-df455hms": {
    realUvp: 550,
    source: "LG DF455HMS Full Size marché ~440-550€",
  },
  "siemens-kompakt-sk25ew800": {
    realUvp: 1100,
    source: "Siemens SK25EW800 marché ~850-1100€",
  },
  "siemens-iq300-sk26e820eu": {
    realUvp: 850,
    source: "Siemens SK26E820EU marché ~680-850€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Staubsauger
  // ==========================================================================
  "aeg-well-q7-animal": {
    realUvp: 700,
    source: "AEG Well Q7 Animal marché ~550-700€",
  },
  "electrolux-800-animalcare": {
    realUvp: 600,
    source: "Electrolux 800 AnimalCare marché ~450-600€",
  },
  "dyson-big-quiet-formaldehyde-n475": {
    realUvp: 800,
    source: "Dyson Big Quiet Formaldehyde marché ~650-800€",
  },
  "bosch-unlimited-serie8-bss81pob": {
    realUvp: 800,
    source: "Bosch BSS81POB marché ~600-800€",
  },
  "bosch-serie6-bbh3d122": {
    realUvp: 550,
    source: "Bosch BBH3D122 marché ~400-550€",
  },
  "lg-cordzero-a9-kompressor": {
    realUvp: 800,
    source: "LG CordZero A9 Kompressor marché ~600-800€",
  },
  "lg-cordzero-thinq-r9": {
    realUvp: 1000,
    source: "LG CordZero ThinQ R9 marché ~800-1000€",
  },
  "ninja-detect-duo-cordless": {
    realUvp: 700,
    source: "Ninja Detect Duo Cordless marché ~550-700€",
  },
  "vorwerk-kobold-vk200": {
    realUvp: 850,
    source: "Vorwerk Kobold VK200 marché ~680-850€",
  },
  "vorwerk-kobold-vk200-plus": {
    realUvp: 1400,
    source: "Vorwerk Kobold VK200 Plus marché ~1100-1400€",
  },
  "philips-powerproactive": {
    realUvp: 600,
    source: "Philips PowerPro Active marché ~480-600€",
  },
  "philips-8000-series-led": {
    realUvp: 1500,
    source: "Philips 8000 Series LED marché ~1200-1500€",
  },
  "xiaomi-robot-vacuum-x10-plus": {
    realUvp: 800,
    source: "Xiaomi Robot Vacuum X10+ marché ~600-800€",
  },
  "samsung-jet-bot-ai-plus-vr50t9990": {
    realUvp: 1200,
    source: "Samsung Jet Bot AI+ VR50T9990 marché ~900-1200€",
  },
  "miele-scout-rx3-home-vision": {
    realUvp: 1150,
    source: "Miele Scout RX3 Home Vision marché ~900-1150€",
  },
  "sichler-pac-wk-10": {
    realUvp: 350,
    source: "Sichler PAC WK10 marché ~250-350€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Waschtrockner
  // ==========================================================================
  "miele-waschtrockner-wt1": {
    realUvp: 1900,
    source: "Miele WT1 marché ~1500-1900€",
  },
  "aeg-ffb62607pm": {
    realUvp: 1200,
    source: "AEG FFB62607PM marché ~900-1200€",
  },
  "electrolux-eeq53200l": {
    realUvp: 700,
    source: "Electrolux EEQ53200L marché ~550-700€",
  },
  "lg-washtower-p9wba": {
    realUvp: 2500,
    source: "LG WashTower P9WBA marché ~2000-2500€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Airfryer & Grill
  // ==========================================================================
  "cosori-lite-airfryer-28l": {
    realUvp: 320,
    source: "Cosori Lite Airfryer marché ~250-320€",
  },
  "cosori-pro2-airfryer-l501": {
    realUvp: 120,
    source: "Cosori Pro II L501 marché ~80-120€",
  },
  "ninja-foodi-dual-zone-af300eu": {
    realUvp: 220,
    source: "Ninja Foodi AF300EU marché ~170-220€",
  },
  "ninja-foodi-max-af400eu": {
    realUvp: 200,
    source: "Ninja Foodi AF400EU marché ~160-200€",
  },
  "moulinex-easy-fry-max-fx9029": {
    realUvp: 130,
    source: "Moulinex Easy Fry Max FX9029 marché ~100-130€",
  },
  "russell-hobbs-retro-air-fryer-24530": {
    realUvp: 80,
    source: "Russell Hobbs Retro Air Fryer marché ~60-80€",
  },
  "sage-the-air-fryer-pro-bpa180": {
    realUvp: 200,
    source: "Sage BPA800 marché ~160-200€",
  },
  "tefal-easy-fry-max-ey4018": {
    realUvp: 200,
    source: "Tefal Easy Fry Max EY4018 marché ~150-200€",
  },
  "tefal-optigrill-plus-gc7148": {
    realUvp: 180,
    source: "Tefal OptiGrill+ GC7148 marché ~140-180€",
  },
  "tefal-easy-grill-precision-dg2558": {
    realUvp: 100,
    source: "Tefal Easy Grill DG2558 marché ~70-100€",
  },
  "tefal-jamie-oliver-cook-smart": {
    realUvp: 100,
    source: "Tefal Jamie Oliver Cook Smart marché ~70-100€",
  },
  "gastroback-advanced-dual-plus-40882": {
    realUvp: 250,
    source: "Gastroback Advanced Dual Plus marché ~180-250€",
  },
  "gastroback-advanced-espresso-42602": {
    realUvp: 200,
    source: "Gastroback Advanced Espresso marché ~150-200€",
  },
  "gastroback-design-pro-42621": {
    realUvp: 400,
    source: "Gastroback Design Pro 42621 marché ~300-400€",
  },
  "ninja-speedi-sp101eu": {
    realUvp: 250,
    source: "Ninja Speedi SP101EU marché ~200-250€",
  },
  "ninja-foodi-multi-cooker-nc300": {
    realUvp: 180,
    source: "Ninja Foodi NC300 marché ~140-180€",
  },
  "midea-air-cool-maw08v1qwt": {
    realUvp: 400,
    source: "Midea MAW08V1QWT marché ~300-400€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Herde
  // ==========================================================================
  "bosch-serie-6-herd-hkh634es5": {
    realUvp: 1900,
    source: "Bosch HKH634ES5 marché ~1500-1900€",
  },
  "lg-instaview-range-lsel6337f": {
    realUvp: 2500,
    source: "LG InstaView Range LSEL6337F marché ~2000-2500€",
  },
  "samsung-bespoke-slide-in-range-nx60bb871112": {
    realUvp: 2600,
    source: "Samsung NX60BB871112 marché ~2100-2600€",
  },
  "samsung-bespoke-french-door-rf29a9675sr": {
    realUvp: 2250,
    source: "Samsung RF29A9675SR marché ~1800-2250€",
  },

  // ==========================================================================
  // KAFFEE — Kaffeevollautomaten
  // ==========================================================================
  "jura-z10-platinum": {
    realUvp: 2500,
    source: "JURA Z10 UVP 2499€ (jura.com), marché ~2199€",
  },
  "jura-e8-platinum": {
    realUvp: 1300,
    source: "JURA E8 marché ~1050-1300€",
  },
  "jura-s8-chrome": {
    realUvp: 2100,
    source: "JURA S8 marché ~1650-2100€",
  },
  "jura-e4-platinum": {
    realUvp: 1100,
    source: "JURA E4 marché ~875-1100€",
  },
  "jura-d6-dark-inox": {
    realUvp: 1250,
    source: "JURA D6 marché ~1000-1250€",
  },
  "delonghi-magnifica-s-ecam22110b": {
    realUvp: 350,
    source: "De'Longhi Magnifica S ECAM22.110.B marché ~280-350€",
  },
  "delonghi-magnifica-evo-ecam29233": {
    realUvp: 700,
    source: "De'Longhi Magnifica Evo marché ~550-700€",
  },
  "delonghi-dinamica-ecam35055": {
    realUvp: 800,
    source: "De'Longhi Dinamica ECAM35055 marché ~650-800€",
  },
  "delonghi-primadonna-soul-ecam61075": {
    realUvp: 1500,
    source: "De'Longhi Primadonna Soul marché ~1200-1500€",
  },
  "saeco-xelsis-sm8780": {
    realUvp: 1800,
    source: "Saeco Xelsis SM8780 marché ~1400-1800€",
  },
  "saeco-granarista-sm5580": {
    realUvp: 850,
    source: "Saeco Granarista SM5580 marché ~680-850€",
  },
  "siemens-eq300-s300": {
    realUvp: 800,
    source: "Siemens EQ.300 marché ~650-800€",
  },
  "siemens-eq500-plus-s500": {
    realUvp: 1300,
    source: "Siemens EQ.500 Plus marché ~1000-1300€",
  },
  "siemens-eq9-plus-s700": {
    realUvp: 1800,
    source: "Siemens EQ.9 plus S700 marché ~1400-1800€",
  },
  "melitta-purista-pure-black-neu": {
    realUvp: 250,
    source: "Melitta Purista marché ~200-250€",
  },
  "melitta-enjoy-5-purge": {
    realUvp: 350,
    source: "Melitta Enjoy 5 Purge marché ~280-350€",
  },
  "melitta-look-v-style-perfekt": {
    realUvp: 450,
    source: "Melitta Look V Style marché ~350-450€",
  },
  "melitta-purista-pure-black": {
    realUvp: 250,
    source: "Melitta Purista Pure Black marché ~200-250€",
  },
  "krups-evidence-plus-ea894c": {
    realUvp: 1200,
    source: "Krups Evidence Plus EA894C marché ~950-1200€",
  },
  "krups-virtuoso-xp442c10": {
    realUvp: 1200,
    source: "Krups Virtuoso XP442C10 marché ~950-1200€",
  },
  "nespresso-citiz-en895": {
    realUvp: 300,
    source: "Nespresso Citiz EN895 marché ~240-300€",
  },
  "nespresso-essenza-mini-d50": {
    realUvp: 200,
    source: "Nespresso Essenza Mini D50 marché ~160-200€",
  },
  "nespresso-lattissima-touch-en560": {
    realUvp: 400,
    source: "Nespresso Lattissima Touch EN560 marché ~320-400€",
  },
  "nespresso-vertuo-next": {
    realUvp: 150,
    source: "Nespresso Vertuo Next marché ~120-150€",
  },
  "nespresso-vertuo-pop": {
    realUvp: 100,
    source: "Nespresso Vertuo Pop marché ~80-100€",
  },
  "nespresso-vertuo-pop-plus": {
    realUvp: 100,
    source: "Nespresso Vertuo Pop+ marché ~80-100€",
  },
  "lavazza-a-modo-mio-jl01": {
    realUvp: 250,
    source: "Lavazza A Modo Mio Jl01 marché ~200-250€",
  },
  "lavazza-idola-clt2020": {
    realUvp: 150,
    source: "Lavazza Idola CLT2020 marché ~120-150€",
  },
  "tchibo-privilegio-bean-to-cup": {
    realUvp: 1200,
    source: "Tchibo Privilegio marché ~950-1200€",
  },
  "tchibo-barista-bean-to-cup": {
    realUvp: 800,
    source: "Tchibo Barista marché ~650-800€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Kaffee (Espresso-Maschinen)
  // ==========================================================================
  "breville-barista-express": {
    realUvp: 700,
    source: "Breville Barista Express marché ~550-700€",
  },
  "breville-barista-express-impress": {
    realUvp: 700,
    source: "Breville Barista Express Impress marché ~550-700€",
  },
  "breville-barista-touch": {
    realUvp: 1200,
    source: "Breville Barista Touch marché ~950-1200€",
  },
  "sage-barista-express-impress": {
    realUvp: 700,
    source: "Sage Barista Express Impress marché ~550-700€",
  },
  "sage-the-dual-boiler": {
    realUvp: 1400,
    source: "Sage The Dual Boiler marché ~1100-1400€",
  },
  "sage-the-oracle-touch": {
    realUvp: 2500,
    source: "Sage The Oracle Touch marché ~2000-2500€",
  },
  "kenwood-multipro-express-fdm79190ba": {
    realUvp: 400,
    source: "Kenwood Multipro Express marché ~300-400€",
  },
  "de-longhi-multifry-fh1394": {
    realUvp: 250,
    source: "De'Longhi Multifry FH1394 marché ~180-250€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Küchenmaschinen & Stabmixer
  // ==========================================================================
  "kitchenaid-artisan-5ksm175pse": {
    realUvp: 600,
    source: "KitchenAid Artisan 5KSM175PSE marché ~480-600€",
  },
  "kitchenaid-artisan-mini-5ksm33": {
    realUvp: 450,
    source: "KitchenAid Artisan Mini 5KSM33 marché ~350-450€",
  },
  "thermomix-tm6": {
    realUvp: 1400,
    source: "Thermomix TM6 UVP 1399€",
  },
  "thermomix-tm7": {
    realUvp: 1600,
    source: "Thermomix TM7 UVP 1599€",
  },
  "vorwerk-thermomix-tm5": {
    realUvp: 1400,
    source: "Vorwerk Thermomix TM5 marché ~1100-1400€",
  },

  // ==========================================================================
  // KÜCHE & KOCHEN — Handmixer complémentaires
  // ==========================================================================
  "philips-hr3655-handmixer": {
    realUvp: 120,
    source: "Philips HR3655 marché ~90-120€",
  },
  "smeg-50er-jahre-hmf02-handmixer": {
    realUvp: 160,
    source: "Smeg HMF02 marché ~120-160€",
  },
  "bosch-mfq3540-handmixer": {
    realUvp: 60,
    source: "Bosch MFQ3540 marché ~45-60€",
  },

  // ==========================================================================
  // KLIMA — Luftreiniger & Klimaanlagen
  // ==========================================================================
  "dyson-pure-cool-tp07": {
    realUvp: 500,
    source: "Dyson Pure Cool TP07 marché ~400-500€",
  },
  "dyson-pure-cool-tp09": {
    realUvp: 550,
    source: "Dyson Pure Cool TP09 marché ~450-550€",
  },
  "dyson-purifier-big-quiet": {
    realUvp: 900,
    source: "Dyson Purifier Big Quiet marché ~730-900€",
  },
  "dyson-purifier-hotcool-hp07": {
    realUvp: 600,
    source: "Dyson Pure Hot+Cool HP07 marché ~480-600€",
  },
  "dyson-purifier-humidifycool-ph01": {
    realUvp: 650,
    source: "Dyson Pure Humidify+Cool PH01 marché ~500-650€",
  },
  "blueair-blue-2210": {
    realUvp: 200,
    source: "Blueair Blue 2210 marché ~150-200€",
  },
  "blueair-blue-3210": {
    realUvp: 200,
    source: "Blueair Blue 3210 marché ~150-200€",
  },
  "blueair-blue-3410": {
    realUvp: 400,
    source: "Blueair Blue 3410 marché ~300-400€",
  },
  "blueair-classic-480i": {
    realUvp: 700,
    source: "Blueair Classic 480i marché ~550-700€",
  },
  "blueair-health-protect-7440i": {
    realUvp: 700,
    source: "Blueair Health Protect 7440i marché ~550-700€",
  },
  "levoit-classic-200s": {
    realUvp: 100,
    source: "Levoit Classic 200S marché ~80-100€",
  },
  "levoit-core-300": {
    realUvp: 100,
    source: "Levoit Core 300 marché ~80-100€",
  },
  "levoit-core-400s": {
    realUvp: 200,
    source: "Levoit Core 400S marché ~160-200€",
  },
  "levoit-lv600s-hybrid": {
    realUvp: 350,
    source: "Levoit LV600S Hybrid marché ~280-350€",
  },
  "trotec-pac-2100-e": {
    realUvp: 500,
    source: "Trotec PAC 2100E marché ~400-500€",
  },
  "trotec-pac-3200-e": {
    realUvp: 600,
    source: "Trotec PAC 3200E marché ~480-600€",
  },
  "trotec-pac-3900-e": {
    realUvp: 800,
    source: "Trotec PAC 3900E marché ~640-800€",
  },
  "stadler-form-airgoing-kne01": {
    realUvp: 300,
    source: "Stadler Form Airgoing marché ~240-300€",
  },
  "stadler-form-oskar": {
    realUvp: 120,
    source: "Stadler Form Oskar marché ~90-120€",
  },
  "stadler-form-oskar-little": {
    realUvp: 80,
    source: "Stadler Form Oskar Little marché ~60-80€",
  },
  "stadler-form-viktor": {
    realUvp: 80,
    source: "Stadler Form Viktor marché ~60-80€",
  },
  "stadler-form-oskar-big": {
    realUvp: 190,
    source: "Stadler Form Oskar Big marché ~150-190€",
  },

  // ==========================================================================
  // SMART HOME
  // ==========================================================================
  "ikea-dirigera-hub": {
    realUvp: 160,
    source: "IKEA DIRIGERA Hub marché ~130-160€",
  },
  "ikea-parasoll-door-window-sensor": {
    realUvp: 35,
    source: "IKEA PARASOLL marché ~28-35€",
  },
  "ikea-praktlysing-smart-blind": {
    realUvp: 100,
    source: "IKEA PRAKTLYSING marché ~80-100€",
  },
  "ikea-starkvind-air-purifier": {
    realUvp: 360,
    source: "IKEA STARKVIND marché ~290-360€",
  },
  "ikea-symfonisk-table-speaker": {
    realUvp: 400,
    source: "IKEA SYMFONISK Table Speaker marché ~320-400€",
  },
  "ikea-tradfri-starter-kit-e27": {
    realUvp: 60,
    source: "IKEA TRÅDFRI Starter Kit marché ~48-60€",
  },
  "ikea-vallhorn-motion-sensor": {
    realUvp: 20,
    source: "IKEA VALLHORN marché ~15-20€",
  },
  "philips-hue-starter-kit-e14": {
    realUvp: 100,
    source: "Philips Hue Starter Kit E14 marché ~80-100€",
  },
  "philips-hue-starter-kit-e27": {
    realUvp: 180,
    source: "Philips Hue Starter Kit E27 marché ~145-180€",
  },
  "philips-hue-starter-kit-e27-neu": {
    realUvp: 260,
    source: "Philips Hue Starter Kit E27 (nouveau) marché ~210-260€",
  },
  "philips-hue-white-ambiance-e27": {
    realUvp: 55,
    source: "Philips Hue White Ambiance E27 marché ~44-55€",
  },
  "philips-hue-gradient-lightstrip-2m": {
    realUvp: 200,
    source: "Philips Hue Gradient Lightstrip 2m marché ~160-200€",
  },
  "philips-hue-lightstrip-plus-2m": {
    realUvp: 100,
    source: "Philips Hue Lightstrip Plus 2m marché ~80-100€",
  },
  "philips-hue-play-gradient-lightstrip-55": {
    realUvp: 170,
    source: "Philips Hue Play Gradient Lightstrip 55 marché ~135-170€",
  },
  "philips-hue-secure-doorbell-camera": {
    realUvp: 350,
    source: "Philips Hue Secure Doorbell Camera marché ~280-350€",
  },
  "philips-hue-secure-camera": {
    realUvp: 200,
    source: "Philips Hue Secure Camera marché ~160-200€",
  },
  "ring-video-doorbell-4": {
    realUvp: 200,
    source: "Ring Video Doorbell 4 marché ~160-200€",
  },
  "ring-video-doorbell-4-neu": {
    realUvp: 200,
    source: "Ring Video Doorbell 4 (nouveau) marché ~160-200€",
  },
  "ring-indoor-cam-gen2": {
    realUvp: 80,
    source: "Ring Indoor Cam Gen2 marché ~60-80€",
  },
  "ring-spotlight-cam-pro": {
    realUvp: 200,
    source: "Ring Spotlight Cam Pro marché ~160-200€",
  },
  "ring-floodlight-cam-wired-pro": {
    realUvp: 200,
    source: "Ring Floodlight Cam Wired Pro marché ~160-200€",
  },
  "ring-alarm-security-kit-5": {
    realUvp: 380,
    source: "Ring Alarm Security Kit 5 marché ~300-380€",
  },
  "ring-alarm-flood-freeze-sensor": {
    realUvp: 60,
    source: "Ring Alarm Flood & Freeze Sensor marché ~50-60€",
  },
  "netatmo-smart-thermostat": {
    realUvp: 180,
    source: "Netatmo Smart Thermostat marché ~140-180€",
  },
  "netatmo-smart-video-doorbell": {
    realUvp: 200,
    source: "Netatmo Smart Video Doorbell marché ~160-200€",
  },
  "netatmo-wetterstation": {
    realUvp: 180,
    source: "Netatmo Wetterstation marché ~140-180€",
  },
  "nanoleaf-elements-hexagons": {
    realUvp: 250,
    source: "Nanoleaf Elements Hexagons marché ~200-250€",
  },
  "nanoleaf-essential-a19-bulb": {
    realUvp: 25,
    source: "Nanoleaf Essential A19 marché ~20-25€",
  },
  "nanoleaf-shapes-hexagons": {
    realUvp: 200,
    source: "Nanoleaf Shapes Hexagons marché ~160-200€",
  },
  "nanoleaf-shapes-squares": {
    realUvp: 250,
    source: "Nanoleaf Shapes Squares marché ~200-250€",
  },
  "nanoleaf-shapes-triangles": {
    realUvp: 220,
    source: "Nanoleaf Shapes Triangles marché ~175-220€",
  },
  "tado-smart-ac-control-v3plus": {
    realUvp: 100,
    source: "tado° Smart AC Control V3+ marché ~80-100€",
  },
  "tado-smart-ac-control-v3plus-neu": {
    realUvp: 100,
    source: "tado° Smart AC Control V3+ (nouveau) marché ~80-100€",
  },
  "tado-smart-radiator-starter-kit": {
    realUvp: 180,
    source: "tado° Smart Radiator Starter Kit marché ~145-180€",
  },
  "tado-smart-thermostat-v3plus": {
    realUvp: 200,
    source: "tado° Smart Thermostat Starter Kit V3+ marché ~160-200€",
  },
  "tado-smart-thermostat-v3plus-single": {
    realUvp: 70,
    source: "tado° Smart Thermostat V3+ seul marché ~55-70€",
  },
  "tado-smart-thermostat-v3plus-extension": {
    realUvp: 70,
    source: "tado° Smart Thermostat V3+ Extension marché ~55-70€",
  },
  "tado-smart-thermostat-v3plus-neu": {
    realUvp: 70,
    source: "tado° Smart Thermostat V3+ (nouveau) marché ~55-70€",
  },
  "samsung-family-hub-rb38b7929s9": {
    realUvp: 500,
    source: "Samsung Family Hub RB38B7929S9 marché ~400-500€",
  },

  // ==========================================================================
  // HAUSHALTSGERÄTE — Sonstiges
  // ==========================================================================
  "comfee-mpph-07crn7": {
    realUvp: 350,
    source: "Comfee MPPH-07CRN7 marché ~280-350€",
  },
  "comfee-mpph-12crn7": {
    realUvp: 500,
    source: "Comfee MPPH-12CRN7 marché ~400-500€",
  },
  "klarstein-fresh-breeze-xl": {
    realUvp: 400,
    source: "Klarstein Fresh Breeze XL marché ~320-400€",
  },
  "klarstein-skyscraper-ice": {
    realUvp: 500,
    source: "Klarstein Skyscraper Ice marché ~400-500€",
  },
  "samsung-side-by-side-rs758711dqp": {
    realUvp: 1500,
    source: "Samsung RS758711DQP marché ~1200-1500€",
  },
};

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("=== HAUSAURA UVP Correction Script ===\n");
  console.log(`Total corrections defined: ${Object.keys(CORRECTIONS).length}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [slug, correction] of Object.entries(CORRECTIONS)) {
    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        select: { id: true, name: true, originalPrice: true, price: true },
      });

      if (!product) {
        console.log(`⚠️  NOT FOUND: ${slug}`);
        skipped++;
        continue;
      }

      const oldUvp = product.originalPrice || 0;
      const newUvp = correction.realUvp;
      const newPrice = Math.round(newUvp * 0.81 * 100) / 100;

      if (oldUvp === newUvp) {
        console.log(`✅ OK: ${slug} (UVP ${oldUvp}€ already correct)`);
        skipped++;
        continue;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: {
          originalPrice: newUvp,
          price: newPrice,
        },
      });

      const factor = oldUvp > 0 ? Math.round(oldUvp / newUvp) : 0;
      console.log(
        `🔧 FIXED: ${product.name}\n` +
        `   UVP: ${oldUvp}€ → ${newUvp}€ (${factor > 0 ? `was ${factor}x inflated` : "new"})\n` +
        `   Prix: ${product.price}€ → ${newPrice}€\n` +
        `   Source: ${correction.source}`
      );
      updated++;
    } catch (e) {
      console.log(`❌ ERROR: ${slug} - ${(e as Error).message}`);
      errors++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
}

main()
  .catch((e) => {
    console.error("FATAL:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
