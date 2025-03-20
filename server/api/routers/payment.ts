import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

const paymentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        method: z.enum(["CASH_ON_DELIVERY", "ESEWA", "KHALTI"]),
        status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
        amount: z.number().positive(),
        transactionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (db) => {
        const existing = await db.payment.findUnique({
          where: { orderId: input.orderId },
        });
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Payment already exists for this order",
          });
        }

        return db.payment.create({
          data: {
            ...input,
            status: "PENDING",
          },
        });
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
        transactionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const paymentRecord = await ctx.db.payment.findUnique({
        where: { id: input.id },
      });

      if (!paymentRecord) {
        throw new Error("Payment record not found");
      }

      // Update the payment record
      return ctx.db.payment.update({
        where: { id: input.id },
        data: {
          status: input.status, 
          transactionId: input.transactionId, 
        },
      });
    }),

  getByOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.payment.findUnique({ where: { orderId: input.orderId } })
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.payment.delete({ where: { id: input.id } })
    ),
});

export default paymentRouter;
