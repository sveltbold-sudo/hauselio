import { mkdirSync, readdirSync } from "fs";
import { join } from "path";

const newSlugs = [
  // Küche & Food
  "kitchenaid-artisan-mini-5ksm33", "vorwerk-thermomix-tm5", "sage-the-bakery-boss",
  "ninja-foodi-multi-cooker-nc300", "wmf-kitchenminis-handmixer", "tefal-jamie-oliver-cook-smart",
  "gastroback-advanced-dual-plus-40882", "vorwerk-kobold-vk200", "kenwood-chef-xl-elite-kvl6325s",
  "russell-hobbs-go-create-handmixer", "bosch-mfq3540-handmixer", "electrolux-assist-9-handmixer",
  "aeg-hm-400-handmixer", "braun-mq7-multiquick-handmixer", "philips-hr3655-handmixer",
  "smeg-hmf01-handmixer", "smeg-50er-jahre-hmf02-handmixer", "russell-hobbs-eagle-23211-handmixer",
  "moulinex-optichef-ht4101-handmixer", "tefal-optichef-ht4508-handmixer", "black-decker-600w-handmixer",
  "kitchenaid-artisan-5khb25ay-handmixer", "bosch-mums2ew48-kuechenmaschine", "moulinex-quickmix-654-handmixer",
  "kenwood-hm430-handmixer",
  // Café
  "jura-e4-platinum", "jura-s8-chrome", "jura-d6-dark-inox",
  "delonghi-magnifica-evo-ecam29233", "delonghi-dinamica-ecam35055", "delonghi-primadonna-soul-ecam61075",
  "siemens-eq9-plus-s700", "siemens-eq500-plus-s500", "siemens-eq300-s300",
  "saeco-xelsis-sm8780", "saeco-granarista-sm5580", "krups-virtuoso-xp442c10",
  "krups-evidence-plus-ea894c", "tchibo-barista-bean-to-cup", "tchibo-privilegio-bean-to-cup",
  "melitta-purista-pure-black-neu", "melitta-look-v-style-perfekt", "melitta-enjoy-5-purge",
  "breville-barista-express", "breville-barista-touch", "sage-barista-express-impress",
  "sage-the-oracle-touch", "sage-the-dual-boiler", "gastroback-design-espresso-42603",
  "gastroback-advanced-espresso-42602", "nespresso-lattissima-touch-en560", "nespresso-essenza-mini-d50",
  "nespresso-vertuo-next", "nespresso-vertuo-pop", "nespresso-citiz-en895",
  "lavazza-a-modo-mio-jl01", "lavazza-idola-clt2020",
  // Aspirateurs
  "dyson-v12-detect-slim", "dyson-v8-absolute", "roborock-s8-maxv-ultra",
  "roborock-q8-max-plus", "irobot-roomba-j9-plus", "irobot-roomba-combo-j5-plus",
  "xiaomi-robot-vacuum-x10-plus", "xiaomi-roborock-pro", "samsung-jet-bot-ai-plus-vr50t9990",
  "lg-cordzero-a9-kompressor", "lg-cordzero-thinq-r9", "kaercher-vc5-cordless",
  "kaercher-vc3-cordless", "miele-triflex-hx2-pro", "miele-scout-rx3-home-vision",
  "philips-8000-series-led", "philips-powerproactive", "electrolux-800-animalcare",
  "aeg-well-q7-animal", "bosch-unlimited-serie8-bss81pob", "bosch-serie6-bbh3d122",
  "siemens-rs5-pro", "samsung-bespoke-jet-complete", "vorwerk-kobold-vk200-plus",
  "ninja-detect-duo-cordless",
  // Cuisson
  "ninja-foodi-dual-zone-af300eu", "ninja-foodi-max-af400eu", "ninja-speedi-sp101eu",
  "cosori-pro2-airfryer-l501", "cosori-lite-airfryer-28l", "tefal-easy-fry-max-ey4018",
  "tefal-optigrill-plus-gc7148", "tefal-easy-grill-precision-dg2558", "wmf-kitchenminis-contact-grill",
  "bosch-serie6-induktionskochfeld-pci611bb5e", "siemens-iq700-induktionskochfeld-ex877ly44e",
  "gaggenau-vario400-kochfeld-vig414", "neff-b3acs7ah0-backofen", "bosch-serie8-backofen-hbg8780b1",
  "miele-h7464bp-backofen", "aeg-bpe842720m-backofen", "electrolux-oeo7gknw-backofen",
  "samsung-bespoke-slide-in-range-nx60bb871112", "lg-instaview-range-lsel6337f",
  "gastroback-design-pro-42621", "russell-hobbs-retro-air-fryer-24530",
  "delonghi-multifry-fh1394", "moulinex-easy-fry-max-fx9029",
  "kenwood-multipro-express-fdm79190ba", "sage-the-air-fryer-pro-bpa180",
  // Waschen & Trocknen
  "miele-w1-waschmaschine-wsd163", "miele-w1-waschmaschine-wsd263", "miele-t1-trockner-tmh843",
  "miele-waschtrockner-wt1", "bosch-serie8-waschmaschine-wau285680", "bosch-serie6-trockner-wtu876680",
  "siemens-iq700-waschmaschine-wg44g2z0", "siemens-iq700-trockner-wt47w5600",
  "samsung-ecobubble-ww90t554daw", "samsung-trockner-dv80ta020ae",
  "lg-turbowash-wv9-1412w", "lg-washtower-p9wba",
  "aeg-lr9a80600-waschmaschine", "aeg-tr9a865r-trockner",
  "electrolux-ew7f348sg-waschmaschine", "electrolux-ew7h348w-trockner",
  "haier-hw100-b1439lu1-waschmaschine", "haier-hd100-a2939-trockner",
  "beko-wrs-55p12-sw-waschmaschine", "beko-dp-8534-gxa1-trockner",
  "bosch-serie2-waschmaschine-wgg244z01", "siemens-iq300-waschmaschine-wg44g200",
  "miele-w1-waschmaschine-wsd363", "miele-t1-trockner-tmv843",
  "samsung-waschmaschine-ww90t684dln", "lg-waschmaschine-f4wr711s2ha",
  "bosch-serie6-waschmaschine-wau28568", "siemens-waschmaschine-wg44g202",
  "beko-trockner-dpy8534gxa1",
  // Froid
  "liebherr-premium-comfort-kgn36vi3", "liebherr-mono-sgne5226", "liebherr-monokuhlschrank-kbes3660",
  "liebherr-komfort-kcbnesf3666", "samsung-family-hub-rb38b7929s9", "samsung-bespoke-lrfx28b3230s",
  "samsung-side-by-side-rs758711dqp", "samsung-gefrierschrank-rz32r743601",
  "bosch-serie6-kuhlschrank-kgn36aw3a", "bosch-serie4-einbau-kuhlschrank-kiv83vse0",
  "siemens-iq700-kuhlschrank-kg39nxb60", "siemens-iq500-einbau-kuhlschrank-kg39eadla0",
  "miele-kuhlschrank-k2801sfvi", "miele-mastercool-mcs1301w",
  "aeg-rcb53426tx-kuhlschrank", "electrolux-lrb3643sw-kuhlschrank",
  "haier-monokuhlschrank-hb14g1aaag", "haier-side-by-side-rs670n4aw1",
  "beko-gne-134620-x-kuhlschrank", "beko-rbst140k25w-kuhlschrank",
  "vzug-rq4601-kuhlschrank", "liebherr-mono-kef3566-gefrierschrank",
  "liebherr-komfort-kbes3660", "samsung-bespoke-french-door-rf29a9675sr",
  "samsung-tiefkuhlschrank-rt5000", "bosch-serie4-gefrierschrank-gin31afe0p",
  "siemens-iq500-einbau-tiefkuhlschrank-gi51nae20", "aeg-rbs-36426tx-kuhlschrank",
  // Lave-vaisselle
  "miele-g7310-scu", "miele-g7360-scvi-autodos", "miele-g5000-sci", "miele-ta-2650-wp",
  "bosch-serie6-smv88tx36e-neu", "bosch-serie4-smv46mx01e", "bosch-kompakt-sms46mw00e",
  "siemens-iq700-sn878x04ce-neu", "siemens-iq500-sn436w00ce", "siemens-kompakt-sk25ew800",
  "aeg-ffb62607pm", "aeg-fsk62600p-kompakt",
  "electrolux-eeq53200l", "electrolux-kompakt-esf6200lou",
  "samsung-dw60m6050fw", "siemens-iq300-sk26e820eu",
  "beko-dfn05320w", "haier-dw14-bk3aeu",
  "lg-df455hms-kompakt", "lg-full-size-df455hms",
  // Klima-Luft
  "dyson-purifier-hotcool-hp07", "dyson-purifier-humidifycool-ph01", "dyson-pure-cool-tp07",
  "stadler-form-oskar", "stadler-form-oskar-little", "stadler-form-viktor",
  "blueair-blue-3410", "blueair-classic-480i", "blueair-health-protect-7440i",
  "levoit-core-300", "levoit-core-400s", "levoit-lv600s-hybrid",
  "trotec-pac-3200-e", "trotec-pac-3900-e",
  "comfee-mpph-07crn7", "comfee-mpph-12crn7",
  "sichler-pac-wk-10", "klarstein-fresh-breeze-xl",
  "stadler-form-airgoing-kne01", "levoit-classic-200s", "blueair-blue-2210",
  "klarstein-skyscraper-ice", "midea-air-cool-maw08v1qwt", "dyson-big-quiet-formaldehyde-n475",
  "trotec-pac-2100-e",
  // Smart Home
  "tado-smart-thermostat-v3plus-neu", "tado-smart-thermostat-v3plus-extension",
  "tado-smart-ac-control-v3plus-neu", "philips-hue-starter-kit-e27-neu",
  "philips-hue-starter-kit-e14", "philips-hue-lightstrip-plus-2m",
  "philips-hue-white-ambiance-e27", "nanoleaf-shapes-triangles",
  "nanoleaf-elements-hexagons", "ring-video-doorbell-4-neu",
  "ring-spotlight-cam-pro", "ring-indoor-cam-gen2",
  "netatmo-wetterstation", "netatmo-smart-thermostat",
  "ikea-tradfri-starter-kit-e27", "ikea-dirigera-hub",
  "ikea-praktlysing-smart-blind", "ring-alarm-security-kit-5",
  "netatmo-smart-video-doorbell", "nanoleaf-shapes-squares",
  "philips-hue-gradient-lightstrip-2m", "ikea-symfonisk-table-speaker",
  "philips-hue-play-gradient-lightstrip-55", "tado-smart-radiator-starter-kit",
  "ring-floodlight-cam-wired-pro", "ikea-parasoll-door-window-sensor",
  "ikea-vallhorn-motion-sensor", "philips-hue-secure-camera",
  "ikea-starkvind-air-purifier", "nanoleaf-essential-a19-bulb",
  "ring-alarm-flood-freeze-sensor", "tado-smart-thermostat-v3plus-single",
  "philips-hue-secure-doorbell-camera",
];

const productsDir = join(process.cwd(), "public", "images", "products");

let created = 0;
for (const slug of newSlugs) {
  const dir = join(productsDir, slug);
  try {
    mkdirSync(dir, { recursive: true });
    created++;
  } catch (error) {
    // Folder already exists
  }
}

console.log(`✅ Created ${created} image folders`);
