import {
  adminProcedure,
  createTRPCRouter,
  sellerProcedure,
} from "@/server/api/trpc";
import {
  shopDeleteSchema,
  shopSchema,
  shopUpdateSchema,
} from "@/validation/shop";
import { z } from "zod";

export const shopRouter = createTRPCRouter({
  create: adminProcedure.input(shopSchema).mutation(async ({ ctx, input }) => {
    const ownerId = ctx.session.user.id as string;
    return ctx.db.shop.create({
      data: {
        ...input,
        ownerId,
      },
    });
  }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.shop.findMany({
      include: {
        shopCategory: {
          select: {
            id: true,
            name: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true, 
            // phoneNumber: true,
          },
        },
      },
    });
  }),

  update: sellerProcedure
    .input(shopUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.shop.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(shopDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shop.delete({
        where: { id: input.id },
      });
    }),
});
