import { db } from "@/server/db";
import { createTRPCRouter, publicProcedure, sellerProcedure } from "../../trpc";
import {
  createProductVariationSchema,
  updateProductVariationSchema,
} from "@/validation/product/variation";
import { deleteProductSchema } from "@/validation/product/product";

const productVariationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return db.productVariation.findMany({
      include: {
        product: {
          include: {
            shop: true,
            productCategory: true,
          },
        },
      },
    });
  }),

  create: sellerProcedure
    .input(createProductVariationSchema)
    .mutation(async ({ input }) => {
      // 🛑 Remove `attributes` from input before inserting into DB
      const { attributes, ...variationData } = input;

      const variation = await db.productVariation.create({
        data: {
          ...variationData, // ✅ Now Prisma won't complain
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: { id: true },
      });

      return variation;
    }),

  update: sellerProcedure
    .input(updateProductVariationSchema)
    .mutation(async ({ input }) => {
      return db.productVariation.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),

  delete: sellerProcedure
    .input(deleteProductSchema)
    .mutation(async ({ input }) => {
      return db.productVariation.delete({ where: { id: input.id } });
    }),
});

export default productVariationRouter;
