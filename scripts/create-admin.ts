import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || "Admin";

async function main() {
  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`Admin with email ${email} already exists. Updating password...`);
    const hashedPassword = await hashPassword(password);
    await prisma.adminUser.update({
      where: { email },
      data: { password: hashedPassword, name },
    });
    console.log(`Admin password updated for ${email}`);
  } else {
    const hashedPassword = await hashPassword(password);
    await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "ADMIN",
      },
    });
    console.log(`Admin created: ${email}`);
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
