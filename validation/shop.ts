import { z } from "zod";

export const shopSchema = z.object({
  name: z
    .string()
    .min(1)
    .trim()
    .toLowerCase(),
  description: z
    .string()
    .min(1)
    .trim()
    .toLowerCase(),
  logo: z.string().url(),
  shopCategoryId: z.string().min(1),
});

export const shopUpdateSchema = shopSchema.extend({
  id: z.string().ulid(), 
});

export const shopDeleteSchema = z.object({
  id: z.string().ulid(), 
});

// Generate TypeScript types from schemas
export type Shop = z.infer<typeof shopSchema>; 
export type ShopUpdate = z.infer<typeof shopUpdateSchema>; 
export type ShopDelete = z.infer<typeof shopDeleteSchema>; 
