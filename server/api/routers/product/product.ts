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
import { z } from "zod";

const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return db.product.findMany({
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

  getMyProducts: sellerProcedure
    .input(z.string().ulid())
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { shopId: input },
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
