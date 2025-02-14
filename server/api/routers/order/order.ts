import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  sellerProcedure,
} from "../../trpc";
import { nanoid } from "nanoid";

const generateOrderNumber = () => `ORD-${nanoid(6)}`;


const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            productVariationId: z.string(),
            quantity: z.number().int().positive(),
            price: z.number().positive(),
          })
        ),
        shippingAddress: z.object({
          fullName: z.string(),
          phoneNumber1: z.string(),
          phoneNumber2: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          country: z.string().default("Nepal"),
          state: z.string(),
          district: z.string(),
          city: z.string().optional(),
          village: z.string().optional(),
          street: z.string(),
          zipCode: z.string().optional(),
          addressType: z.enum(["HOME", "WORK", "OTHER"]).default("HOME"),
        }),
        paymentMethod: z.enum(["CASH_ON_DELIVERY", "ESEWA", "KHALTI"]),
        total: z.number().positive(),
        transactionId: z.string().optional(),
        shippingCost: z.number().optional().default(0),
        tax: z.number().optional().default(0),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id as string;

      const subTotal = input.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const total = subTotal + input.shippingCost + input.tax;

      return ctx.db.$transaction(async (db) => {
        const order = await db.order.create({
          data: {
            userId: userId,
            shippingAddress: input.shippingAddress,
            orderNumber: generateOrderNumber(),
            subTotal,
            shippingCost: input.shippingCost,
            tax: input.tax,
            total,
            notes: input.notes,
          },
        });

        await db.orderItem.createMany({
          data: input.items.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            productVariationId: item.productVariationId,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
          })),
        });

        await db.payment.create({
          data: {
            orderId: order.id,
            method: input.paymentMethod,
            amount: input.total,
            status: "PENDING",
            transactionId: input.transactionId,
          },
        });

        return order;
      });
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true, // Order ID
        createdAt: true, // Order date
        status: true, // Order status
        total: true, // Total amount
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      date: order.createdAt,
      totalItems: order.items.length,
      status: order.status,
      total: order.total,
    }));
  }),

  getMyOrderById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findUnique({
        where: { id: input, userId: ctx.session.user.id },
        include: {
          items: {
            include: {
              product: true, // Fetch product details along with items
            },
          },
          payment: true,
        },
      });
    }),

  updateOrderByAdminById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z
          .enum([
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
          ])
          .optional(),
        shippingCost: z.number().optional(),
        tax: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.$transaction(async (db) => {
        const currentOrder = await db.order.findUnique({ where: { id } });
        if (!currentOrder) throw new TRPCError({ code: "NOT_FOUND" });

        const newShippingCost =
          data.shippingCost ?? currentOrder.shippingCost ?? 0;
        const newTax = data.tax ?? currentOrder.tax ?? 0;
        const total = currentOrder.subTotal + newShippingCost + newTax;

        return db.order.update({
          where: { id },
          data: {
            ...data,
            shippingCost: newShippingCost,
            tax: newTax,
            total,
          },
        });
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.order.delete({ where: { id: input.id } })
    ),

  getAllOrder: adminProcedure.query(({ ctx }) => {
    return ctx.db.order.findMany({
      include: { items: true },
    });
  }),

  getOrderById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.order.findUnique({
        where: { id: input.id },
        include: { items: true },
      })
    ),

  getSellerOrders: sellerProcedure.query(async ({ ctx, input }) => {
    const sellerId = ctx.session.user.id;

    // Find the shop that belongs to this seller
    const shop = await ctx.db.shop.findFirst({
      where: { ownerId: sellerId },
      select: { id: true },
    });

    if (!shop) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Seller does not own a shop.",
      });
    }

    // Fetch only order items for this seller's shop
    const orders = await ctx.db.orderItem.findMany({
      where: {
        product: {
          shopId: shop.id, // Ensure product belongs to the seller's shop
        },
      },
      select: {
        id: true,
        orderId: true,
        productId: true,
        productVariationId: true,
        quantity: true,
        price: true,
        totalPrice: true,
        order: {
          select: {
            createdAt: true, // Order date
          },
        },
        product: {
          select: {
            name: true, // Product name
            shopId: true, // Ensure it's linked to seller's shop
          },
        },
      },
    });

    if (!orders.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No orders found for this seller.",
      });
    }

    return orders;
  }),
});

export default orderRouter;
