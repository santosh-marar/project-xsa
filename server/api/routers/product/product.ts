import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
  sellerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { AgeRangeEnum, GenderEnum } from "@/validation/product/attribute";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "@/validation/product/product";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const getAllProductsInput = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  filters: z
    .object({
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sizes: z.array(z.string()).optional(),
      gender: z.array(GenderEnum).optional(),
      ageRange: z.array(AgeRangeEnum).optional(),
      categories: z.array(z.string()).optional(),
    })
    .optional(),
});

const getMyProductsInput = z.object({
  shopId: z.string().ulid(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  filters: z
    .object({
      categories: z.array(z.string()).optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      // status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
    })
    .optional(),
});

const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(getAllProductsInput)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, search, filters } = input;

      // Build the where clause
      const baseWhere: Prisma.ProductWhereInput[] = [];

      if (search) {
        baseWhere.push({
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        });
      }

      if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
        baseWhere.push({
          productVariations: {
            some: {
              price: {
                gte: filters.minPrice,
                lte: filters.maxPrice,
              },
            },
          },
        });
      }

      if (filters?.sizes?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              OR: [
                { tShirtAttributes: { size: { in: filters.sizes } } },
                { pantAttributes: { size: { in: filters.sizes } } },
                { shoeAttributes: { size: { in: filters.sizes } } },
                { shirtAttributes: { size: { in: filters.sizes } } },
                { jacketAttributes: { size: { in: filters.sizes } } },
                { undergarmentAttributes: { size: { in: filters.sizes } } },
              ],
            },
          },
        });
      }

      if (filters?.gender?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              OR: [
                { tShirtAttributes: { gender: { in: filters.gender } } },
                { pantAttributes: { gender: { in: filters.gender } } },
                { shirtAttributes: { gender: { in: filters.gender } } },
                { jacketAttributes: { gender: { in: filters.gender } } },
                { hoodieAttributes: { gender: { in: filters.gender } } },
                { undergarmentAttributes: { gender: { in: filters.gender } } },
              ],
            },
          },
        });
      }

      if (filters?.ageRange?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              OR: [
                { tShirtAttributes: { ageRange: { in: filters.ageRange } } },
                { pantAttributes: { ageRange: { in: filters.ageRange } } },
                { shirtAttributes: { ageRange: { in: filters.ageRange } } },
                { jacketAttributes: { ageRange: { in: filters.ageRange } } },
                { hoodieAttributes: { ageRange: { in: filters.ageRange } } },
                {
                  undergarmentAttributes: {
                    ageRange: { in: filters.ageRange },
                  },
                },
              ],
            },
          },
        });
      }

      if (filters?.categories?.length) {
        baseWhere.push({
          productCategory: { name: { in: filters.categories } },
        });
      }

      const where: Prisma.ProductWhereInput = baseWhere.length
        ? { AND: baseWhere }
        : {};

      let orderBy: Prisma.ProductOrderByWithRelationInput = {
        createdAt: sortOrder ?? "desc",
      };

      if (sortBy && sortBy !== "price") {
        orderBy = {
          [sortBy]: sortOrder ?? "asc",
        };
      }

      const [
        products,
        total,
        priceRange,
        sizes,
        genders,
        ageRanges,
        categories,
      ] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: {
            shop: true,
            productCategory: true,
            productVariations: {
              include: {
                tShirtAttributes: true,
                pantAttributes: true,
                shoeAttributes: true,
                shirtAttributes: true,
                jacketAttributes: true,
                hoodieAttributes: true,
                undergarmentAttributes: true,
                genericAttributes: true,
              },
              ...(sortBy === "price"
                ? {
                    orderBy: {
                      price: sortOrder ?? "asc",
                    },
                  }
                : {}),
            },
          },
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        ctx.db.product.count({ where }),
        ctx.db.productVariation.aggregate({
          _min: { price: true },
          _max: { price: true },
        }),
        // Query for distinct sizes
        ctx.db.$queryRaw<Array<{ size: string }>>`
          SELECT DISTINCT size FROM (
            SELECT "TShirtAttributes"."size" FROM "TShirtAttributes"
            UNION
            SELECT "PantAttributes"."size" FROM "PantAttributes"
            UNION
            SELECT "ShoeAttributes"."size" FROM "ShoeAttributes"
            UNION
            SELECT "ShirtAttributes"."size" FROM "ShirtAttributes"
            UNION
            SELECT "JacketAttributes"."size" FROM "JacketAttributes"
            UNION
            SELECT "UndergarmentAttributes"."size" FROM "UndergarmentAttributes"
          ) AS sizes WHERE size IS NOT NULL
        `,
        // Query for distinct genders
        ctx.db.$queryRaw<Array<{ gender: string }>>`
          SELECT DISTINCT gender FROM (
            SELECT "TShirtAttributes"."gender" FROM "TShirtAttributes"
            UNION
            SELECT "PantAttributes"."gender" FROM "PantAttributes"
            UNION
            SELECT "ShirtAttributes"."gender" FROM "ShirtAttributes"
            UNION
            SELECT "JacketAttributes"."gender" FROM "JacketAttributes"
            UNION
            SELECT "HoodieAttributes"."gender" FROM "HoodieAttributes"
            UNION
            SELECT "UndergarmentAttributes"."gender" FROM "UndergarmentAttributes"
          ) AS genders WHERE gender IS NOT NULL
        `,
        // Query for distinct age ranges (using the actual column name "agerange")
        ctx.db.$queryRaw<Array<{ ageRange: string }>>`
  SELECT DISTINCT "ageRange" FROM (
    SELECT "ageRange" FROM "TShirtAttributes"
    UNION
    SELECT "ageRange" FROM "PantAttributes"
    UNION
    SELECT "ageRange" FROM "ShirtAttributes"
    UNION
    SELECT "ageRange" FROM "JacketAttributes"
    UNION
    SELECT "ageRange" FROM "HoodieAttributes"
    UNION
    SELECT "ageRange" FROM "UndergarmentAttributes"
  ) AS ageRanges WHERE "ageRange" IS NOT NULL
`,
        ctx.db.productCategory.findMany({
          select: {
            id: true,
            name: true,
            _count: { select: { products: true } },
          },
        }),
      ]);

      return {
        products,
        metadata: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: page * pageSize < total,
          hasPreviousPage: page > 1,
        },
        filters: {
          priceRange: {
            min: priceRange._min.price,
            max: priceRange._max.price,
          },
          sizes: sizes.map((s) => s.size),
          gender: genders.map((g) => g.gender),
          ageRange: ageRanges.map((a) => a.ageRange),
          categories: (categories ?? []).map((c) => ({
            id: c.id,
            name: c.name,
            productCount: c._count.products,
          })),
        },
      };
    }),

  getMyProducts: sellerProcedure
    .input(getMyProductsInput)
    .query(async ({ ctx, input }) => {
      const { shopId, page, pageSize, search, sortBy, sortOrder, filters } =
        input;

      // Build the where clause
      const baseWhere: Prisma.ProductWhereInput[] = [
        // Base shop filter
        { shopId },
      ];

      // Add search filter
      if (search) {
        baseWhere.push({
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            // {
            //   sku: {
            //     contains: search,
            //     mode: Prisma.QueryMode.insensitive,
            //   },
            // },
          ],
        });
      }

      // Add category filter
      if (filters?.categories?.length) {
        baseWhere.push({
          productCategory: {
            name: { in: filters.categories },
          },
        });
      }

      // Add price range filter
      if (filters?.minPrice || filters?.maxPrice) {
        baseWhere.push({
          productVariations: {
            some: {
              price: {
                gte: filters.minPrice,
                lte: filters.maxPrice,
              },
            },
          },
        });
      }

      // Add status filter
      // if (filters?.status) {
      //   baseWhere.push({ status: filters.status });
      // }

      // Combine all conditions
      const where: Prisma.ProductWhereInput = {
        AND: baseWhere,
      };

      // Build the orderBy clause - fixed for proper Prisma typing
      let orderBy: Prisma.ProductOrderByWithRelationInput = {
        createdAt: sortOrder ?? "desc",
      };

      if (sortBy && sortBy !== "price") {
        orderBy = {
          [sortBy]: sortOrder ?? "asc",
        };
      }

      // Execute query with pagination
      const [products, total] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: {
            shop: true,
            productCategory: true,
            productVariations: {
              include: {
                tShirtAttributes: true,
                pantAttributes: true,
                shirtAttributes: true,
                jacketAttributes: true,
                hoodieAttributes: true,
                undergarmentAttributes: true,
                shoeAttributes: true,
                genericAttributes: true,
              },
              ...(sortBy === "price"
                ? {
                    orderBy: {
                      price: sortOrder ?? "asc",
                    },
                  }
                : {}),
            },
          },
          orderBy,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        ctx.db.product.count({ where }),
      ]);

      // Get available filters for UI
      const availableFilters = await ctx.db.productCategory.findMany({
        where: { products: { some: { shopId } } },
        select: {
          id: true,
          name: true,
          _count: {
            select: { products: true },
          },
        },
      });

      // Get price range for current shop's products
      const priceRange = await ctx.db.productVariation.aggregate({
        where: { product: { shopId } },
        _min: { price: true },
        _max: { price: true },
      });

      return {
        products,
        metadata: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: page * pageSize < total,
          hasPreviousPage: page > 1,
        },
        filters: {
          categories: availableFilters,
          priceRange: {
            min: priceRange._min.price,
            max: priceRange._max.price,
          },
        },
      };
    }),

  getById: sellerProcedure.input(z.string()).query(async ({ input }) => {
    return db.product.findUnique({
      where: { id: input },
      include: {
        shop: true,
        productCategory: true,
        productVariations: {
          include: {
            tShirtAttributes: true,
            pantAttributes: true,
            shirtAttributes: true,
            jacketAttributes: true,
            hoodieAttributes: true,
            undergarmentAttributes: true,
            shoeAttributes: true,
            genericAttributes: true,
          },
        },
      },
    });
  }),

  create: sellerProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const product = await db.product.create({
        data: { ...input, createdAt: new Date(), updatedAt: new Date() },
        select: { id: true }, // Select only the `id`
      });

      return product;
    }),

  update: sellerProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return db.product.update({
        where: { id },
        data: { ...rest, updatedAt: new Date() },
      });
    }),

  delete: sellerProcedure
    .input(deleteProductSchema)
    .mutation(async ({ input }) => {
      await db.product.delete({ where: { id: input.id } });
      return true;
    }),
});

export default productRouter;
