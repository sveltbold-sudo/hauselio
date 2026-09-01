import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing HAUSELIO references in database...\n");

  // Fix testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: { content: { contains: "HAUSELIO" } },
  });

  console.log(`Found ${testimonials.length} testimonials with HAUSELIO`);

  for (const t of testimonials) {
    const newContent = t.content!.replace(/HAUSELIO/g, "HAUSAURA");
    await prisma.testimonial.update({
      where: { id: t.id },
      data: { content: newContent },
    });
    console.log(`  ✓ Testimonial ${t.id} fixed`);
  }

  // Fix SiteSettings
  const settings = await prisma.siteSettings.findFirst();
  if (settings?.bankAccountName?.includes("HAUSELIO")) {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { bankAccountName: settings.bankAccountName.replace(/HAUSELIO/g, "HAUSAURA") },
    });
    console.log("  ✓ SiteSettings.bankAccountName fixed");
  }

  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
