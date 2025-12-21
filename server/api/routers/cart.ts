import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id as string;

    const cart = await ctx.db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            productVariation: true,
          },
        },
      },
    });

    if (!cart) {
      return ctx.db.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
              productVariation: true,
            },
          },
        },
      });
    }

    return cart;
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        productVariationId: z.string(),
        quantity: z.number().int().positive(),
        totalPrice: z.number().int().positive(),
        totalDiscountPrice: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      let cart = await ctx.db.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await ctx.db.cart.create({
          data: {
            userId,
          },
        });
      }

      const existingItem = await ctx.db.cartItem.findUnique({
        where: {
          cartId_productVariationId: {
            cartId: cart.id,
            productVariationId: input.productVariationId,
          },
        },
        select:{
          id:true,
          quantity:true,
          productVariation:{
            select:{
              price:true,
              discountPrice:true
            }
          }
        }
      });

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + input.quantity;
        const { price, discountPrice } = existingItem.productVariation;
        return ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: updatedQuantity,
            totalPrice: updatedQuantity * price,
            totalDiscountPrice: discountPrice
              ? updatedQuantity * discountPrice
              : null,
          },
        });
      }

      return ctx.db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: input.productId,
          productVariationId: input.productVariationId,
          quantity: input.quantity,
          totalDiscountPrice:input.totalDiscountPrice,
          totalPrice:input.totalPrice,
        },
      });
    }),

  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      const cart = await ctx.db.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found",
        });
      }

      const cartItem = await ctx.db.cartItem.findFirst({
        where: {
          id: input.cartItemId,
          cartId: cart.id,

        },
        select:{
          id:true,
          quantity:true,
          productVariation:{
            select:{
              price:true,
              discountPrice:true
            }
          }
        }
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found in cart",
        });
      }

      const { price, discountPrice } = cartItem.productVariation;
      return ctx.db.cartItem.update({
        where: { id: input.cartItemId },
        data: {
          quantity: input.quantity,
          totalPrice: input.quantity * price,
          totalDiscountPrice: discountPrice
            ? input.quantity * discountPrice
            : null,
        },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ cartItemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      const cart = await ctx.db.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found",
        });
      }

      const cartItem = await ctx.db.cartItem.findFirst({
        where: {
          id: input.cartItemId,
          cartId: cart.id,
        },
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found in cart",
        });
      }

      return ctx.db.cartItem.delete({
        where: { id: input.cartItemId },
      });
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id as string;

    const cart = await ctx.db.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cart not found",
      });
    }

    await ctx.db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return ctx.db.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });
  }),
});
