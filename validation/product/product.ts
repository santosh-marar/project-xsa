import { z } from "zod";

export const productSchema = z.object({
  id: z.string().ulid(),
  shopId: z.string().min(1, "Shop ID is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  brand: z.string().optional(),
  material: z.string().optional(),
  categoryId: z.string().min(1, "Category ID is required"),
  image: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateProduct = z.infer<typeof createProductSchema>;

// Update Schemas (Partial fields allowed, but ID require)
export const updateProductSchema = productSchema
  .partial()
  .extend({ id: z.string().ulid() });
export type UpdateProduct = z.infer<typeof updateProductSchema>;

// Delete Schemas (Only ID required)
export const deleteProductSchema = z.object({ id: z.string().ulid() });
export type DeleteProduct = z.infer<typeof deleteProductSchema>;
