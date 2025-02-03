import { z } from "zod";

export const productVariationSchema = z.object({
  id: z.string().ulid(),
  productId: z.string().min(1, "Product ID is required"),
  price: z.number().positive("Price must be greater than zero"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  image: z.array(z.string()).optional(),
  modelNumber: z.string().optional(),
  warranty: z.string().optional(),
  attributes: z.record(
    z.string(),
    z.string().min(1, "Attribute value is required")
  ),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const createProductVariationSchema = productVariationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductVariationSchema = productVariationSchema
  .partial()
  .extend({ id: z.string().ulid() });

export const deleteProductVariationSchema = z.object({ id: z.string().ulid() });

export type ProductVariation = z.infer<typeof productVariationSchema>;
export type UpdateProductVariation = z.infer<
  typeof updateProductVariationSchema
>;
export type DeleteProductVariation = z.infer<
  typeof deleteProductVariationSchema
>;
