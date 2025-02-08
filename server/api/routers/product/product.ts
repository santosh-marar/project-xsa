import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
  sellerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "@/validation/product/product";
import { AgeRangeEnum, GenderEnum } from "@/validation/product/variation";
import { Prisma } from "@prisma/client";
import { z } from "zod";


export const getAllProductSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  filters: z
    .object({
      materials: z.array(z.string()).optional(),
      brands: z.array(z.string()).optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      genders: z.array(GenderEnum).optional(),
      ageRanges: z.array(AgeRangeEnum).optional(),
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
  getAllProducts: publicProcedure
    .input(getAllProductSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, sortBy, sortOrder, search, filters } = input;

      // Build the where clause
      const baseWhere: Prisma.ProductWhereInput[] = [
        {
          productVariations: {
            some: {
              OR: [
                { tShirtAttributes: { isNot: null } },
                { pantAttributes: { isNot: null } },
                { shirtAttributes: { isNot: null } },
                { jacketAttributes: { isNot: null } },
                { hoodieAttributes: { isNot: null } },
                { undergarmentAttributes: { isNot: null } },
                { shoeAttributes: { isNot: null } },
                { genericAttributes: { isNot: null } },
              ],
            },
          },
        },
      ];

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

      // Price filter (from ProductVariation)
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

      // Category filter
      if (filters?.categories?.length) {
        baseWhere.push({
          productCategory: {
            name: { in: filters.categories },
          },
        });
      }

      // Material filter (from Product)
      if (filters?.materials?.length) {
        baseWhere.push({
          material: {
            in: filters.materials,
          },
        });
      }

      // Brand filter (from Product)
      if (filters?.brands?.length) {
        baseWhere.push({
          brand: {
            in: filters.brands,
          },
        });
      }

      // Color filter (from ProductVariation)
      if (filters?.colors?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              color: {
                in: filters.colors,
              },
            },
          },
        });
      }

      // Size filter (from ProductVariation)
      if (filters?.sizes?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              size: {
                in: filters.sizes,
              },
            },
          },
        });
      }

      // Gender filter (from ProductVariation)
      if (filters?.genders?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              gender: {
                in: filters.genders, // Fix: Using `in` for array filtering
              },
            },
          },
        });
      }

      // Age Range filter (from ProductVariation)
      if (filters?.ageRanges?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              ageRange: {
                in: filters.ageRanges, // Fix: Using `in` for array filtering
              },
            },
          },
        });
      }

      const where: Prisma.ProductWhereInput = { AND: baseWhere };

      let orderBy: Prisma.ProductOrderByWithRelationInput = {
        createdAt: sortOrder ?? "desc",
      };

      if (sortBy && sortBy !== "price") {
        orderBy = {
          [sortBy]: sortOrder ?? "asc",
        };
      }

      // Get distinct values for filter options
      const [
        products,
        total,
        priceRange,
        categories,
        // From Product model
        availableMaterials,
        availableBrands,
        // From ProductVariation model
        availableSizes,
        availableColors,
      ] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: {
            productCategory: true,
            productVariations: {
              select: {
                id: true,
                price: true,
                stock: true,
                image: true,
                size: true,
                color: true,
                gender: true,
                ageRange: true,
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
        ctx.db.productCategory.findMany({
          select: {
            id: true,
            name: true,
            _count: { select: { products: true } },
          },
        }),
        // Get materials from Product
        ctx.db.product.findMany({
          select: { material: true },
          distinct: ["material"],
          where: {
            material: { not: null },
          },
        }),
        // Get brands from Product
        ctx.db.product.findMany({
          select: { brand: true },
          distinct: ["brand"],
          where: {
            brand: { not: null },
          },
        }),
        // Get sizes from ProductVariation
        ctx.db.productVariation.findMany({
          select: { size: true },
          distinct: ["size"],
        }),
        // Get colors from ProductVariation
        ctx.db.productVariation.findMany({
          select: { color: true },
          distinct: ["color"],
        }),
      ]);

      const minPrice = priceRange._min.price ?? 0;
      const maxPrice = priceRange._max.price ?? 0;

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
            min: minPrice,
            max: maxPrice,
          },
          categories: categories.map((c) => ({
            id: c.id,
            name: c.name,
            productCount: c._count.products,
          })),
          // From Product
          materials: availableMaterials
            .map((m) => m.material)
            .filter((m): m is string => m !== null),
          brands: availableBrands
            .map((b) => b.brand)
            .filter((b): b is string => b !== null),
          // From ProductVariation
          sizes: availableSizes.map((s) => s.size),
          colors: availableColors.map((c) => c.color),
          genders: Object.values(GenderEnum),
          ageRanges: Object.values(AgeRangeEnum),
        },
      };
    }),

  getAll: publicProcedure
    .input(getAllProductSchema)
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

      // Price filter
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

      // Material filter (from Product)
      if (filters?.materials?.length) {
        baseWhere.push({
          material: {
            in: filters.materials,
          },
        });
      }

      // Brand filter (from Product)
      if (filters?.brands?.length) {
        baseWhere.push({
          brand: {
            in: filters.brands,
          },
        });
      }

      // Size filter (from ProductVariation)
      if (filters?.sizes?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              size: {
                in: filters.sizes,
              },
            },
          },
        });
      }

      // Color filter (from ProductVariation)
      if (filters?.colors?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              color: {
                in: filters.colors,
              },
            },
          },
        });
      }

      // Gender filter (from ProductVariation)
      if (filters?.genders?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              gender: {
                in: filters.genders,
              },
            },
          },
        });
      }

      // Age Range filter (from ProductVariation)
      if (filters?.ageRanges?.length) {
        baseWhere.push({
          productVariations: {
            some: {
              ageRange: {
                in: filters.ageRanges,
              },
            },
          },
        });
      }

      // Category filter
      if (filters?.categories?.length) {
        baseWhere.push({
          productCategory: {
            name: { in: filters.categories },
          },
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
        availableMaterials,
        availableBrands,
        availableSizes,
        availableColors,
        availableGenders,
        availableAgeRanges,
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
        // Get materials from Product
        ctx.db.product.findMany({
          select: { material: true },
          distinct: ["material"],
          where: {
            material: { not: null },
          },
        }),
        // Get brands from Product
        ctx.db.product.findMany({
          select: { brand: true },
          distinct: ["brand"],
          where: {
            brand: { not: null },
          },
        }),
        // Get sizes from ProductVariation
        ctx.db.productVariation.findMany({
          select: { size: true },
          distinct: ["size"],
        }),
        // Get colors from ProductVariation
        ctx.db.productVariation.findMany({
          select: { color: true },
          distinct: ["color"],
        }),
        // Get genders from ProductVariation
        ctx.db.productVariation.findMany({
          select: { gender: true },
          distinct: ["gender"],
          where: {
            gender: { not: null },
          },
        }),
        // Get age ranges from ProductVariation
        ctx.db.productVariation.findMany({
          select: { ageRange: true },
          distinct: ["ageRange"],
          where: {
            ageRange: { not: null },
          },
        }),
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
          // From Product
          materials: availableMaterials
            .map((m) => m.material)
            .filter((m): m is string => m !== null),
          brands: availableBrands
            .map((b) => b.brand)
            .filter((b): b is string => b !== null),
          // From ProductVariation
          sizes: availableSizes.map((s) => s.size),
          colors: availableColors.map((c) => c.color),
          genders: Object.values(GenderEnum),
          ageRanges: Object.values(AgeRangeEnum),
          categories: categories.map((c) => ({
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
