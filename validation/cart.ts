import { z } from "zod";

// Input validation schemas
export const addToCartSchema = z.object({
  productId: z.string(),
  productVariationId: z.string(),
  quantity: z.number().min(1),
  price: z.number().positive(),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string(),
  quantity: z.number().min(1),
});

export const removeFromCartSchema = z.object({
  cartItemId: z.string(),
});

export type AddToCartSchema = z.infer<typeof addToCartSchema>;
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCartItemSchema = z.infer<typeof removeFromCartSchema>;
