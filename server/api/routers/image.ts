import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const imageRouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
        base64: z.string(),
        folder: z.string().optional().default("uploads"),
      })
    )
    .mutation(async ({ input }) => {
      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      });

      const buffer = Buffer.from(input.base64, "base64");
      const key = `${input.folder}/${crypto.randomUUID()}-${input.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: input.type,
      });

      await s3Client.send(command);

      return {
        url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Implement delete logic
      return { success: true };
    }),
});
