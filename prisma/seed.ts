import { db } from "@/server/db";

// prisma/seed.ts
async function main() {
  // Create basic roles
  const roles = ["super_admin", "admin", "seller", "user"];

  for (const role of roles) {
    await db.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        description: `${role} role`,
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
