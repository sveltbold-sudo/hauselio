const sharp = require("sharp");
const path = require("path");

const SRC_ICON = path.join(__dirname, "../public/logos/iconedulogo.png");
const SRC_LOGO = path.join(__dirname, "../public/logos/logoprincipale.png");
const OUT = path.join(__dirname, "../public");

async function generate() {
  console.log("Generating favicons and icons from iconedulogo.png...\n");

  // Favicon PNGs
  const faviconSizes = [
    { size: 16, name: "favicon-16x16.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 192, name: "android-chrome-192x192.png" },
    { size: 512, name: "android-chrome-512x512.png" },
  ];

  for (const { size, name } of faviconSizes) {
    await sharp(SRC_ICON)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT, name));
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // Apple touch icon (180x180)
  await sharp(SRC_ICON)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, "apple-touch-icon.png"));
  console.log("  ✓ apple-touch-icon.png (180x180)");

  // Favicon.ico (multi-size: 16x16 + 32x32)
  const ico16 = await sharp(SRC_ICON).resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const ico32 = await sharp(SRC_ICON).resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  // For .ico, we write the 32x32 as the primary (browsers handle it)
  await sharp(ico32).toFile(path.join(OUT, "favicon.ico"));
  console.log("  ✓ favicon.ico (32x32)");

  // OG Image — logo on brand background (1200x630 for social sharing)
  console.log("\nGenerating og-image.png from logoprincipale.png...\n");
  const ogWidth = 1200;
  const ogHeight = 630;
  const bgColor = "#FAFAF8"; // matches --color-bg

  // Get logo dimensions to calculate scaling
  const logoMeta = await sharp(SRC_LOGO).metadata();
  const maxLogoWidth = ogWidth * 0.6;
  const maxLogoHeight = ogHeight * 0.3;
  const scale = Math.min(maxLogoWidth / logoMeta.width, maxLogoHeight / logoMeta.height);
  const logoW = Math.round(logoMeta.width * scale);
  const logoH = Math.round(logoMeta.height * scale);

  const logoBuffer = await sharp(SRC_LOGO)
    .resize(logoW, logoH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create background
  const bg = sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: bgColor,
    },
  });

  // Composite logo centered
  await bg
    .composite([{
      input: logoBuffer,
      left: Math.round((ogWidth - logoW) / 2),
      top: Math.round((ogHeight - logoH) / 2),
    }])
    .png()
    .toFile(path.join(OUT, "og-image.png"));
  console.log("  ✓ og-image.png (1200x630)");

  console.log("\nDone! All logos and favicons generated.");
}

generate().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
