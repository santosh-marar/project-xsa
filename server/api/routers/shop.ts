import {
    adminProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { shopDeleteSchema, shopSchema, shopUpdateSchema } from "@/validation/shop";
import { z } from "zod";

export const shopRouter = createTRPCRouter({
  // Create Shop
  create: adminProcedure.input(shopSchema).mutation(async ({ ctx, input }) => {
    const ownerId = ctx.session.user.id as string; // Replace this with the logged-in user ID
    return ctx.db.shop.create({
      data: {
        ...input,
        ownerId,
      },
    });
  }),

  // Get All Shops
  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.shop.findMany({
      include: {
        shopCategory: true, // Assuming the category relationship exists
      },
    });
  }),

  // Update Shop
  update: adminProcedure
    .input(shopUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.shop.update({
        where: { id },
        data,
      });
    }),

  // Delete Shop
  delete: adminProcedure
    .input(shopDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shop.delete({
        where: { id: input.id },
      });
    }),
});
