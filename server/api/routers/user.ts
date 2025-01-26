import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    return profile ?? null;
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users ?? null;
  }),
});
