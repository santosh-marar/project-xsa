import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { DiscountType, DiscountScope, Role, Prisma } from "@prisma/client";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { isAdminOrShopOwner } from "@/lib/auth";
import { calculateDiscountPrice, updateVariationPrices } from "@/lib/discount-calculation";

export const discountRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        shopId: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        discountType: z.nativeEnum(DiscountType),
        discountScope: z.nativeEnum(DiscountScope),
        value: z.number().positive(),
        minPurchase: z.number().positive().optional(),
        minItems: z.number().int().positive().optional(),
        usageLimit: z.number().int().positive().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional().nullable(),
        isActive: z.boolean().optional(),
        allowStacking: z.boolean().optional(),
        priority: z.number().int().positive().optional(),
        buyQuantity: z.number().int().positive().optional(),
        getQuantity: z.number().int().positive().optional(),
        appliedToProductId: z.string().optional(),
        autoApply: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Authorization Check
      await isAdminOrShopOwner(
        { id: ctx.session.user.id!, role: ctx.session.user.role },
        input.shopId
      );

      // 2. BOGO Validation
      if (input.discountType === "BUY_X_GET_Y") {
        if (!input.buyQuantity || !input.getQuantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "BOGO discounts require buyQuantity and getQuantity",
          });
        }
        if (input.discountScope !== "PRODUCT" || !input.appliedToProductId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "BOGO discounts must target a specific product",
          });
        }
      }

      // 3. Create Discount
      return await ctx.db.discount.create({
        data: {
          ...input,
          startDate: input.startDate ?? new Date(),
          isActive: input.isActive ?? true,
          allowStacking: input.allowStacking ?? false,
          priority: input.priority ?? 1,
          autoApply: input.autoApply ?? false,
        },
      });
    }),

  adminList: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
        isActive: z.boolean().optional(),
        search: z.string().optional(),
        shopId: z.string().optional(),
        discountType: z.nativeEnum(DiscountType).optional(),
        discountScope: z.nativeEnum(DiscountScope).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.DiscountWhereInput = {
        ...(input.shopId && { shopId: input.shopId }),
        ...(input.discountType && { discountType: input.discountType }),
        ...(input.discountScope && { discountScope: input.discountScope }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" } },
            { description: { contains: input.search, mode: "insensitive" } },
          ],
        }),
      };

      const [discounts, total, activeCount] = await Promise.all([
        ctx.db.discount.findMany({
          where,
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          orderBy: { priority: "asc" },
          include: {
            shop: { select: { id: true, name: true } },
            ProductVariationDiscounts: {
              include: {
                variation: {
                  include: {
                    product: true,
                  },
                },
              },
            },
            categoryDiscounts: {
              include: {
                category: true,
              },
            },
          },
        }),
        ctx.db.discount.count({ where }),
        ctx.db.discount.count({ where: { ...where, isActive: true } }),
      ]);

      return {
        discounts,
        metadata: {
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
          hasNextPage: input.page * input.pageSize < total,
          hasPreviousPage: input.page > 1,
        },
        filters: {
          status: [
            { id: "active", name: "Active", count: activeCount },
            { id: "inactive", name: "Inactive", count: total - activeCount },
          ],
        },
      };
    }),

  sellerList: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
        isActive: z.boolean().optional(),
        search: z.string().optional(),
        discountType: z.nativeEnum(DiscountType).optional(),
        discountScope: z.nativeEnum(DiscountScope).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const shop = await ctx.db.shop.findFirst({
        where: { ownerId: ctx.session.user.id },
        select: { id: true },
      });

      if (!shop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You don't own any shop",
        });
      }

      const where: Prisma.DiscountWhereInput = {
        shopId: shop.id,
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.discountType && { discountType: input.discountType }),
        ...(input.discountScope && { discountScope: input.discountScope }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" } },
            { description: { contains: input.search, mode: "insensitive" } },
          ],
        }),
      };

      const [discounts, total, activeCount] = await Promise.all([
        ctx.db.discount.findMany({
          where,
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          orderBy: { priority: "asc" },
          include: {
            ProductVariationDiscounts: {
              include: {
                variation: {
                  include: {
                    product: true,
                  },
                },
              },
            },
            categoryDiscounts: {
              include: {
                category: true,
              },
            },
          },
        }),
        ctx.db.discount.count({ where }),
        ctx.db.discount.count({ where: { ...where, isActive: true } }),
      ]);

      return {
        discounts,
        metadata: {
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(total / input.pageSize),
          hasNextPage: input.page * input.pageSize < total,
          hasPreviousPage: input.page > 1,
        },
        filters: {
          status: [
            { id: "active", name: "Active", count: activeCount },
            { id: "inactive", name: "Inactive", count: total - activeCount },
          ],
        },
      };
    }),

  // Get a discount by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const discount = await db.discount.findUnique({
        where: { id: input.id },
        include: {
          ProductVariationDiscounts: {
            include: { variation: true },
          },
          categoryDiscounts: {
            include: { category: true },
          },
          shop: true,
        },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      // Verify user has permission to view this discount
      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner({ id: userId, role }, discount.shopId!);

      return discount;
    }),

  // Toggle discount status (active/inactive)
  toggleStatus: protectedProcedure
    .input(z.object({ id: z.string(), shopId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner({ id: userId, role }, input.shopId);
      const discount = await db.discount.findUnique({
        where: { id: input.id },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      return await db.discount.update({
        where: { id: input.id },
        data: { isActive: !discount.isActive },
      });
    }),

  // Update a discount
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        value: z.number().positive().optional(),
        minPurchase: z.number().positive().optional().nullable(),
        minItems: z.number().int().positive().optional().nullable(),
        usageLimit: z.number().int().positive().optional().nullable(),
        endDate: z.date().optional().nullable(),
        isActive: z.boolean().optional(),
        allowStacking: z.boolean().optional(),
        priority: z.number().int().positive().optional(),
        autoApply: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First get the discount to check shop ownership
      const discount = await db.discount.findUnique({
        where: { id: input.id },
        select: { shopId: true },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      // Verify user has permission to update this discount
      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner({ id: userId, role }, discount.shopId!);

      // Update the discount
      return await db.discount.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          value: input.value,
          minPurchase: input.minPurchase,
          minItems: input.minItems,
          usageLimit: input.usageLimit,
          endDate: input.endDate,
          isActive: input.isActive,
          allowStacking: input.allowStacking,
          priority: input.priority,
          autoApply: input.autoApply,
        },
      });
    }),

  // Delete a discount
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First get the discount to check shop ownership
      const discount = await db.discount.findUnique({
        where: { id: input.id },
        select: { shopId: true },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner({ id: userId, role }, discount.shopId!);

      return await db.discount.delete({
        where: { id: input.id },
      });
    }),

  addVariationDiscounts: protectedProcedure
    .input(
      z.object({
        discountId: z.string().ulid(),
        variationIds: z.array(z.string().ulid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Verify discount exists and user has permission
      const discount = await ctx.db.discount.findUnique({
        where: { id: input.discountId },
        select: { shopId: true, discountScope: true, isActive: true },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      await isAdminOrShopOwner(
        { id: ctx.session.user.id!, role: ctx.session.user.role },
        discount.shopId!
      );

      // 2. Verify discount scope
      if (discount.discountScope !== "PRODUCT") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot add variations to a non-PRODUCT scope discount",
        });
      }

      // 3. Create associations in transaction
      await ctx.db.$transaction(async (tx) => {
        // Create ProductVariationDiscount relations
        await tx.productVariationDiscount.createMany({
          data: input.variationIds.map((variationId) => ({
            discountId: input.discountId,
            variationId,
          })),
          skipDuplicates: true,
        });

        // Update variation prices if discount is active
        if (discount.isActive) {
          await updateVariationPrices(tx, input.discountId);
        }
      });

      return { success: true };
    }),

  deleteVariationDiscounts: protectedProcedure
    .input(
      z.object({
        discountId: z.string(),
        variationIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Verify discount exists and user has permission
      const discount = await ctx.db.discount.findUnique({
        where: { id: input.discountId },
        select: { shopId: true },
      });
      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }
      await isAdminOrShopOwner(
        { id: ctx.session.user.id!, role: ctx.session.user.role },
        discount.shopId as string
      );

      // 2. Remove associations in transaction
      await ctx.db.$transaction(async (tx) => {
        // Remove ProductVariationDiscount relations
        await tx.productVariationDiscount.deleteMany({
          where: {
            discountId: input.discountId,
            variationId: { in: input.variationIds },
          },
        });

        // Reset prices for these variations if they have no other active discounts
        const activeDiscounts = await tx.productVariationDiscount.findMany({
          where: {
            variationId: { in: input.variationIds },
            discount: {
              isActive: true,
              startDate: { lte: new Date() },
              OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
            },
          },
          select: { variationId: true },
        });

        const activeVariationIds = activeDiscounts.map((d) => d.variationId);
        const variationsToReset = input.variationIds.filter(
          (id) => !activeVariationIds.includes(id)
        );

        if (variationsToReset.length > 0) {
          // Get the current regular prices for these variations to update cart items
          const variations = await tx.productVariation.findMany({
            where: {
              id: { in: variationsToReset },
            },
            select: {
              id: true,
              price: true,
            },
          });

          const variationPriceMap = variations.reduce((map, variation) => {
            map[variation.id] = variation.price;
            return map;
          }, {} as Record<string, number>);

          // 1. Reset discountPrice on variations
          await tx.productVariation.updateMany({
            where: {
              id: { in: variationsToReset },
              discountPrice: { not: null },
            },
            data: { discountPrice: null },
          });

          // 2. Update cart items that use these variations
          for (const variationId of variationsToReset) {
            const regularPrice = variationPriceMap[variationId];

            // Find all cart items with this variation
            const cartItems = await tx.cartItem.findMany({
              where: {
                productVariationId: variationId,
                totalDiscountPrice: { not: null }, // Only update items that have a discount applied
              },
            });

            // Update each cart item
            for (const item of cartItems) {
              await tx.cartItem.update({
                where: { id: item.id },
                data: {
                  totalDiscountPrice: null,
                  totalPrice: regularPrice * item.quantity,
                },
              });
            }
          }
        }
      });

      return { success: true };
    }),

  getProductDiscountVariations: protectedProcedure.query(async ({ ctx }) => {
    // 1. Get authenticated user's shop
    const shop = await ctx.db.shop.findFirst({
      where: { ownerId: ctx.session.user.id },
      select: { id: true },
    });

    if (!shop) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't own a shop",
      });
    }

    // 2. Fetch all discount-variation relationships for this shop
    const discountVariations = await ctx.db.productVariationDiscount.findMany({
      where: {
        discount: {
          shopId: shop.id,
          isActive: true, // Only include active discounts
        },
      },
      include: {
        discount: true,
        variation: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        discount: {
          priority: "desc", // Show higher priority discounts first
        },
      },
    });

    // 3. Transform data to client-friendly format
    return discountVariations.map((dv) => ({
      relationId: dv.id,
      discount: {
        id: dv.discount.id,
        name: dv.discount.name,
        type: dv.discount.discountType,
        value: dv.discount.value,
        maxValue: dv.discount.maxDiscountValue,
        validUntil: dv.discount.endDate,
      },
      variation: {
        id: dv.variation.id,
        modelNumber: dv.variation.modelNumber,
        price: dv.variation.price,
        discountedPrice: dv.variation.discountPrice,
        stock: dv.variation.stock,
        image:
          dv.variation.image[0] ||
          dv.variation.product.image[0] ||
          "/placeholder.jpg",
        productName: dv.variation.product.name,
        productId: dv.variation.product.id,
      },
    }));
  }),

  // Add categories to a discount
  addCategories: protectedProcedure
    .input(
      z.object({
        discountId: z.string(),
        categoryIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First get the discount to check shop ownership
      const discount = await db.discount.findUnique({
        where: { id: input.discountId },
        select: { shopId: true, discountScope: true },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      // Verify user has permission to modify this discount
      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner({ id: userId, role }, discount.shopId as string);

      // Verify discount scope allows category associations
      if (discount.discountScope !== "CATEGORY") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot add categories to a non-CATEGORY scope discount",
        });
      }

      // Create the associations
      await db.categoryDiscount.createMany({
        data: input.categoryIds.map((categoryId) => ({
          discountId: input.discountId,
          categoryId,
        })),
        skipDuplicates: true,
      });

      return { success: true };
    }),

  // Remove categories from a discount
  removeCategories: protectedProcedure
    .input(
      z.object({
        discountId: z.string(),
        categoryIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First get the discount to check shop ownership
      const discount = await db.discount.findUnique({
        where: { id: input.discountId },
        select: { shopId: true },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      // Verify user has permission to modify this discount
      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner(
        { id: userId, role },
        discount?.shopId as string
      );

      // Delete the associations
      await db.categoryDiscount.deleteMany({
        where: {
          discountId: input.discountId,
          categoryId: { in: input.categoryIds },
        },
      });

      return { success: true };
    }),

  // Apply discount to cart
  applyToCart: protectedProcedure
    .input(
      z.object({
        discountId: z.string(),
        cartId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First get the discount to check shop ownership
      const discount = await db.discount.findUnique({
        where: { id: input.discountId },
        select: { shopId: true, discountScope: true },
      });

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount not found",
        });
      }

      // Verify user has permission to modify this discount
      const userId = ctx.session.user.id as string;
      const role = ctx.session.user.role;
      await isAdminOrShopOwner({ id: userId, role }, discount.shopId!);

      // Verify discount scope allows cart application
      if (discount.discountScope !== "CART") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot apply non-CART scope discount to cart",
        });
      }

      // Create the cart association
      await db.cartDiscount.create({
        data: {
          discountId: input.discountId,
          cartId: input.cartId,
        },
      });

      return { success: true };
    }),

  // Remove discount from cart
  removeFromCart: protectedProcedure
    .input(
      z.object({
        discountId: z.string(),
        cartId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete the association (no need to check permissions since it's cart-specific)
      await db.cartDiscount.delete({
        where: {
          discountId_cartId: {
            discountId: input.discountId,
            cartId: input.cartId,
          },
        },
      });

      return { success: true };
    }),
});
