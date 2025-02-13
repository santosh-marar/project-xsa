import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const orderItemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        productId: z.string(),
        productVariationId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (db) => {
        // Create the order item
        const orderItem = await db.orderItem.create({
          data: {
            ...input,
            totalPrice: input.price * input.quantity,
          },
        });

        // Fetch all order items to recalculate subtotal
        const items = await db.orderItem.findMany({
          where: { orderId: input.orderId },
        });

        const subTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Fetch the existing order
        const existingOrder = await db.order.findUnique({
          where: { id: input.orderId },
          select: {
            shippingCost: true,
            tax: true,
          },
        });

        if (!existingOrder) {
          throw new Error("Order not found");
        }

        // Update order totals
        await db.order.update({
          where: { id: input.orderId },
          data: {
            subTotal,
            total:
              subTotal +
              (existingOrder.shippingCost || 0) +
              (existingOrder.tax || 0),
          },
        });

        return orderItem;
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number().int().positive().optional(),
        price: z.number().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (db) => {
        // Fetch the current order item
        const currentItem = await db.orderItem.findUnique({
          where: { id: input.id },
        });

        if (!currentItem) throw new TRPCError({ code: "NOT_FOUND" });

        // Use existing values if new values are not provided
        const quantity = input.quantity ?? currentItem.quantity;
        const price = input.price ?? currentItem.price;

        // Update the order item
        const updatedItem = await db.orderItem.update({
          where: { id: input.id },
          data: {
            quantity,
            price,
            totalPrice: quantity * price,
          },
        });

        // Fetch all items in the order to recalculate totals
        const items = await db.orderItem.findMany({
          where: { orderId: currentItem.orderId },
        });
        const subTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Fetch the existing order to get `shippingCost` and `tax`
        const existingOrder = await db.order.findUnique({
          where: { id: currentItem.orderId },
          select: {
            shippingCost: true,
            tax: true,
          },
        });

        if (!existingOrder) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        // Update the order totals
        await db.order.update({
          where: { id: currentItem.orderId },
          data: {
            subTotal,
            total:
              subTotal +
              (existingOrder.shippingCost || 0) +
              (existingOrder.tax || 0),
          },
        });

        return updatedItem;
      });
    }),

  deleteOrderItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (db) => {
        // Delete the order item
        const item = await db.orderItem.delete({ where: { id: input.id } });

        // Fetch all remaining items in the order
        const items = await db.orderItem.findMany({
          where: { orderId: item.orderId },
        });
        const subTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Fetch the existing order to get `shippingCost` and `tax`
        const existingOrder = await db.order.findUnique({
          where: { id: item.orderId },
          select: {
            shippingCost: true,
            tax: true,
          },
        });

        if (!existingOrder) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }

        // Update the order totals
        await db.order.update({
          where: { id: item.orderId },
          data: {
            subTotal,
            total:
              subTotal +
              (existingOrder.shippingCost || 0) +
              (existingOrder.tax || 0),
          },
        });

        return item;
      });
    }),
});

export default orderItemRouter;
