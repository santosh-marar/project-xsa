import { z } from "zod";

export const shopCategorySchema = z.object({
  name: z.string().trim().toLowerCase(),
  description: z.string().trim().toLowerCase(),
});

export const shopCategoryUpdateSchema = shopCategorySchema.extend({
  id: z.string().ulid(), 
});

export const shopCategoryDeleteSchema = z.object({
  id: z.string().ulid(), 
});

// Generate TypeScript types from schemas
export type ShopCategory = z.infer<typeof shopCategorySchema>; // Type for creating a shop category
export type ShopCategoryUpdate = z.infer<typeof shopCategoryUpdateSchema>; // Type for updating a shop category
export type ShopCategoryDelete = z.infer<typeof shopCategoryDeleteSchema>; // Type for deleting a shop category
