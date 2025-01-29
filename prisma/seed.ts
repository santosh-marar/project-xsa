import { db } from "@/server/db";
import { rolesSchema } from "@/validation/role";
import { shopCategorySchema } from "@/validation/shop-category";

const roles = [
  { name: "super_admin", description: "Super admin role" },
  { name: "admin", description: "Admin role" },
  { name: "seller", description: "Seller role" },
  { name: "user", description: "User role" },
];

const shopCategories = [
  { name: "Electronics", description: "Electronics category" },
  { name: "Clothing", description: "Clothing category" },
  { name: "Toys", description: "Toys category" },
];

async function main() {
  for (let role of roles) {
    const validatedData = rolesSchema.safeParse(role);
    if (!validatedData.success) {
      console.error("❌ Role validation failed:", validatedData.error);
      continue;
    }
    await db.role.create({ data: validatedData.data });
  }

  for (let shopCategory of shopCategories) {
    const validatedData = shopCategorySchema.safeParse(shopCategory);
    if (!validatedData.success) {
      console.error("❌ Shop category validation failed:", validatedData.error);
      continue;
    }
    await db.shopCategory.create({ data: validatedData.data });
  }

  console.log("🚀 Seeding complete!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });

  