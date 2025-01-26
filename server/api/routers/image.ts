import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { imageDeleteSchema, imageValidation } from "@/validation/image";
import { s3Client } from "@/config/s3-config";
import { z } from "zod";

export const imageRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(imageValidation)
    .mutation(async ({ input }) => {
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

  deleteImage: protectedProcedure
    .input(imageDeleteSchema)
    .mutation(async ({ input }) => {
      const { url } = input;
      const parsedUrl = new URL(url);
      const key = decodeURIComponent(parsedUrl.pathname.slice(1));

      const command = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: key,
      });

      await s3Client.send(command);

      return { success: true, deletedUrl: url };
    }),

  // Multiple image deletion
  deleteImages: protectedProcedure
    .input(z.object({ urls: z.array(z.string().url()) }))
    .mutation(async ({ input }) => {
      const deletedUrls: string[] = [];

      for (const url of input.urls) {
        const parsedUrl = new URL(url);
        const key = decodeURIComponent(parsedUrl.pathname.slice(1));

        const command = new DeleteObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
          Key: key,
        });

        await s3Client.send(command);
        deletedUrls.push(url);
      }

      return { success: true, deletedUrls };
    }),
});
