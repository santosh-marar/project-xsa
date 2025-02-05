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

export const shopRouter = createTRPCRouter({
  create: sellerProcedure.input(shopSchema).mutation(async ({ ctx, input }) => {
    const ownerId = ctx.session.user.id as string;

    const existingShop = await ctx.db.shop.findFirst({
      where: { ownerId },
    });

    if (existingShop) {
      throw new Error("Shop already exists");
    }

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

  getMyShops: sellerProcedure.query(async ({ ctx }) => {
    return ctx.db.shop.findMany({
      where: { ownerId: ctx.session.user.id },
      include: {
        shopCategory: {
          select: {
            id: true,
            name: true,
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

  delete: sellerProcedure
    .input(shopDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shop.delete({
        where: { id: input.id },
      });
    }),
});
