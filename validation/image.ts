import { z } from "zod";

export const imageValidation = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  base64: z.string(),
  folder: z.string().optional().default("uploads"),
});

export const imageDeleteSchema = z.object({
  url: z.string().url(),
});

export type ImageValidation = z.infer<typeof imageValidation>;
export type ImageDeleteSchema = z.infer<typeof imageDeleteSchema>;
