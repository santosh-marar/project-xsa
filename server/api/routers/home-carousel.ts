import { addHomeCarouselSchema, deleteHomeCarouselSchema, updateHomeCarouselSchema } from "@/validation/home-carousel";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const homeCarouselRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await db.homeCarousel.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await db.homeCarousel.findUnique({
        where: { id },
      });
    }),

  create: adminProcedure
    .input(addHomeCarouselSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, subtitle, price, image, link, bgColor, bgImage } = input;
      const data = await db.homeCarousel.create({
        data: {
          title,
          subtitle,
          price,
          image,
          link,
          bgColor,
          bgImage,
        },
      });
      return data;
    }),


  update: adminProcedure
    .input(updateHomeCarouselSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, title, subtitle, price, image, link, bgColor, bgImage } =
        input;
      const data = await db.homeCarousel.update({
        where: {
          id,
        },
        data: {
          title,
          subtitle,
          price,
          image,
          link,
          bgColor,
          bgImage,
        },
      });
      return data;
    }),

    
  delete: adminProcedure
    .input(deleteHomeCarouselSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const data = await db.homeCarousel.delete({
        where: {
          id,
        },
      });
      return data;
    }),
});