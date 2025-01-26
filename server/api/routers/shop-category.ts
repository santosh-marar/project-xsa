import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { shopCategoryDeleteSchema, shopCategorySchema, shopCategoryUpdateSchema } from "@/validation/shop-category";
import { z } from "zod";

export const shopCategoryRouter = createTRPCRouter({
  createShopCategory: adminProcedure
    .input(shopCategorySchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.shopCategory.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  getAllShopCategory: publicProcedure.query(async({ ctx }) => {
    const shopCategories = await ctx.db.shopCategory.findMany();
    return shopCategories;
  }),

  getShopCategoryById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return db.shopCategory.findUnique({
        where: { id: input },
      });
    }),

  updateShopCategory: adminProcedure
    .input(shopCategoryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, description } = input;
      return db.shopCategory.update({
        where: { id },
        data: { name, description },
      });
    }),

  deleteShopCategory: adminProcedure
    .input(shopCategoryDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return db.shopCategory.delete({
        where: { id },
      });
    }),
});
