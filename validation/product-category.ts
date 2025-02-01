import { z } from "zod";

export const ProductCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  parentId: z.string().nullable(),
  description: z.string(),
});

export const ProductCategoryUpdateSchema = ProductCategorySchema.extend({
  id: z.string().ulid(),
});

export const ProductCategoryDeleteSchema = z.object({
  id: z.string().ulid(),
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductCategoryUpdate = z.infer<typeof ProductCategoryUpdateSchema>;
export type DeleteProductCategory = z.infer<typeof ProductCategoryDeleteSchema>;
