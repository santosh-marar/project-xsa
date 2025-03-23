import {z} from "zod";


export const addHomeCarouselSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().url("Must be a valid URL"),
  link: z.string().url("Must be a valid URL"),
  bgColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").optional(),
  bgImage: z.string().url("Must be a valid URL").nullable().optional(),
});

export const updateHomeCarouselSchema = addHomeCarouselSchema.extend({
  id: z.string().ulid().min(1, "ID is required"),
});

export const deleteHomeCarouselSchema = z.object({
  id: z.string().ulid().min(1, "ID is required"),
});

export type AddHomeCarouselSchema = z.infer<typeof addHomeCarouselSchema>;
export type UpdateHomeCarouselSchema = z.infer<typeof updateHomeCarouselSchema>;
export type DeleteHomeCarouselSchema = z.infer<typeof deleteHomeCarouselSchema>;