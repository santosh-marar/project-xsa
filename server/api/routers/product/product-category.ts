import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  ProductCategoryDeleteSchema,
  ProductCategorySchema,
  ProductCategoryUpdateSchema,
} from "@/validation/product-category";

export const productCategoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return db.productCategory.findMany({
      include: {
        parentCategory: true,
        subCategories: {
          include: {
            subCategories: true, // Include nested subcategories if needed
          },
        },
      },
    });
  }),

  create: adminProcedure
    .input(ProductCategorySchema.omit({ id: true }))
    .mutation(async ({ input }) => {
      return db.productCategory.create({
        data: { ...input, createdAt: new Date(), updatedAt: new Date() },
      });
    }),

  update: adminProcedure
    .input(ProductCategoryUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return db.productCategory.update({
        where: { id },
        data: { ...rest, updatedAt: new Date() },
      });
    }),

  delete: adminProcedure
    .input(ProductCategoryDeleteSchema)
    .mutation(async ({ input }) => {
      await db.productCategory.delete({ where: { id: input.id } });
      return true;
    }),
});
