import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MAPPING: Record<string, Record<string, string[]>> = {
  kueche: {
    Thermomix: ["thermomix", "tm5", "tm6", "tm7"],
    Küchenmaschinen: [
      "küchenmaschine", "kuechenmaschine", "multipro", "multi cooker",
      "chef xl", "chef xl elite", "bakery boss", "artisan 5ksm", "artisan mini",
      "quickmix", "hm02", "hm01", "nc300", "speedi", "dual plus",
      "cook smart",
    ],
    Handmixer: [
      "handmixer", "hm 400", "hm430", "hm-400", "mq7", "artisan 5khb",
      "hr3655", "optichef ht4101", "quickmix 654", "eagle 23211",
      "go create", "kitchenminis handmixer",
    ],
    Backöfen: [
      "backofen", "hbg8780", "hb778ges", "b3acs7ah", "oeo7gknw", "h7464bp",
    ],
    Kochfelder: [
      "kochfeld", "induktionskochfeld", "vario 200", "vario400",
      "ex877ly", "pci611bb", "herd hkh634", "range", "slide in range",
      "instaview range", "nx60bb",
    ],
    Airfryer: [
      "airfryer", "air fryer", "easy fry", "foodi dual zone", "foodi max",
      "speedi sp101", "retro air fryer", "lite airfryer", "pro2 airfryer",
      "multifry",
    ],
    "Grill & Kontaktgrill": [
      "grill", "optigrill", "contact grill", "easy grill",
    ],
  },
  kaffee: {
    Kaffeevollautomaten: [
      "magnifica", "dinamica", "primadonna", "barista express",
      "barista touch", "oracle touch", "dual boiler", "evidence",
      "xelsis", "granarista", "eq9", "eq500", "eq300", "virtuoso",
      "bean to cup", "e8", "e4", "s8", "z10", "d6", "e8 platinum",
      "e4 platinum", "jura", "krups", "saeco", "tchibo", "design pro 42621",
    ],
    Espressomaschinen: ["espresso", "citiz", "lattissima"],
    Kapselmaschinen: ["essenza", "vertuo", "nespresso", "a modo mio", "idola"],
    Filterkaffee: [
      "enjoy", "purista", "melitta", "look v style", "purista aromatica",
    ],
  },
  reinigung: {
    Staubsauger: [
      "v12", "v15", "v8", "cordzero", "triflex", "well q7",
      "powerproactive", "unlimited", "rs5", "kobold", "big ball",
      "gen5detect", "800 animalcare", "detect duo", "bbh3d122",
      "8000 series", "big quiet", "jet complete", "vc3", "vc5",
      "cx7",
    ],
    Saugroboter: [
      "roomba", "jet bot", "scout rx3", "q8 max", "s8 maxv",
      "roborock", "xiaomi robot", "roomba combo",
    ],
    Dampfreiniger: ["sc 4", "kaercher sc", "dampfreiniger"],
  },
  klima: {
    Luftreiniger: [
      "blueair", "levoit", "starkvind", "health protect", "pure cool",
      "purifier", "core 300", "core 400", "lv600", "classic 200",
    ],
    Luftbefeuchter: [
      "humidify", "oskar", "viktor", "airgoing", "form oskar",
    ],
    Luftkühler: [
      "pac", "midea air cool", "fresh breeze", "skyscraper", "air cool",
      "mpph",
    ],
  },
  "smart-home": {
    "Smart-Beleuchtung": [
      "hue", "nanoleaf", "lightstrip", "gradient", "a19 birne",
      "tradfri", "ambiance e27", "shapes", "smartblind", "starkvind",
    ],
    "Smart-Heizung": [
      "smart thermostat", "tado", "netatmo smart thermostat",
    ],
    "Smart-Überwachung": [
      "ring", "doorbell", "camera", "fensterkontakt", "bewegungsmelder",
      "video doorbell", "parasoll", "vallhorn", "floodlight cam",
      "indoor cam", "spotlight cam", "alarm", "video doorbell 4",
    ],
    "Smart-Hubs & Zubehör": [
      "dirigera", "starter kit", "symfonisk", "wetterstation",
      "speaker", "tabelle", "hub",
    ],
  },
  haushaltsgeraete: {
    Waschmaschinen: [
      "waschmaschine", "ww90", "wgg244", "ecobubble", "turbowash",
      "wg44g", "wci870", "wsd163", "wsd263", "wsd363", "washtower",
    ],
    Trockner: [
      "trockner", "tmh843", "tmv843", "dv80", "wt47w", "trk845",
      "wtu876680", "trockner dpy",
    ],
    Geschirrspüler: [
      "geschirrsp", "sms46", "smv88", "smv6e", "smv46", "sn63",
      "sn43", "sn878", "dw60", "dw14", "g5000", "g7310", "g7360", "g7966",
      "ffb62607", "esf6200", "df455hms", "sms4eci", "ta 2650",
    ],
    Kühlschränke: [
      "kühlschrank", "kuhlschrank", "monokühlschrank", "monokuhl",
      "side by side", "french door", "family hub", "einbau",
      "kgn36", "kgn36aw", "kg39", "kcbnesf", "kbes3660", "rb38",
      "rb39", "rf29", "rs670", "rs758", "lrfx28", "mastercool",
      "sk25ew", "sk26e820", "fsk62600", "ke230", "eeq53200",
    ],
    Gefrierschränke: [
      "gefrierschrank", "tiefkuhlschrank", "gin31afe", "kef3566",
      "sgne5226", "rz32r", "rt5000", "dfn05320",
    ],
  },
};

function matchProduct(name: string, slug: string, categorySlug: string): string | null {
  const cat = MAPPING[categorySlug];
  if (!cat) return null;
  const lower = (name + " " + slug).toLowerCase();

  for (const [sub, keywords] of Object.entries(cat)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) return sub;
    }
  }
  return null;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { subCategory: null },
    select: { id: true, name: true, slug: true, category: { select: { slug: true } } },
  });

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    const catSlug = p.category?.slug;
    if (!catSlug) { skipped++; continue; }

    const sub = matchProduct(p.name, p.slug, catSlug);
    if (!sub) {
      console.log(`SKIP: ${p.name} (${catSlug}) — no match`);
      skipped++;
      continue;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: { subCategory: sub },
    });
    updated++;
    console.log(`OK: ${p.name} → ${sub}`);
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
