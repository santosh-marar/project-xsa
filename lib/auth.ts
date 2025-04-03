import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { Role } from "@prisma/client";

/**
 * Verify if user is either admin/super_admin OR the owner of a shop
 */
export async function isAdminOrShopOwner(
  user: { id: string; role: Role[] },
  shopId: string
): Promise<true> {
  // Admins always pass
  if (user.role.some((r) => ["admin", "super_admin"].includes(r.name)))
    return true;

  // Non-admins must be the shop owner
  const shop = await db.shop.findUnique({
    where: { id: shopId },
    select: { ownerId: true },
  });

  if (!shop)
    throw new TRPCError({ code: "NOT_FOUND", message: "Shop not found" });
  if (shop.ownerId !== user.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only shop owners or admins can perform this action",
    });
  }

  return true;
}

/**
 * Verify product ownership
 */
export async function verifyProductOwnership(
  user: { id: string; role: Role[] },
  productId: string
): Promise<true> {
  // Admins bypass ownership checks
  if (user.role.some((r) => ["admin", "super_admin"].includes(r.name)))
    return true;

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { shop: { select: { ownerId: true } } },
  });

  if (!product)
    throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
  if (product.shop.ownerId !== user.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't own this product",
    });
  }

  return true;
}
