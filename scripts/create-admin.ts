import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import * as readline from "readline";

const email = process.argv[2];
const name = process.argv[3] || "Admin";

function promptPassword(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("Password: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  if (!email) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> [name]");
    console.error("Password will be prompted interactively.");
    process.exit(1);
  }

  const password = await promptPassword();

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
