import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  createProductCategorySchema,
  deleteProductCategorySchema,
  updateProductCategorySchema,
} from "@/validation/product/category";

const productCategoryRouter = createTRPCRouter({
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
    .input(createProductCategorySchema)
    .mutation(async ({ input }) => {
      return db.productCategory.create({
        data: { ...input },
      });
    }),

  update: adminProcedure
    .input(updateProductCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return db.productCategory.update({
        where: { id },
        data: { ...rest, updatedAt: new Date() },
      });
    }),

  delete: adminProcedure
    .input(deleteProductCategorySchema)
    .mutation(async ({ input }) => {
      await db.productCategory.delete({ where: { id: input.id } });
      return true;
    }),
});

export default productCategoryRouter;
