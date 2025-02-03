import { z } from "zod";

export const productCategorySchema = z.object({
  id: z.string().ulid(),
  parentId: z.string().nullable(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createProductCategorySchema = productCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductCategorySchema = productCategorySchema
  .partial()
  .extend({ id: z.string().ulid() });

export const deleteProductCategorySchema = z.object({ id: z.string().ulid() });

export type ProductCategory = z.infer<typeof productCategorySchema>;
export type UpdateProductCategory = z.infer<typeof updateProductCategorySchema>;
export type DeleteProductCategory = z.infer<typeof deleteProductCategorySchema>;
