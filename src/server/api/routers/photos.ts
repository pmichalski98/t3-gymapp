import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { S3 } from "aws-sdk";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const s3 = new S3({
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  region: "eu-central-1",
});
export const photosRouter = createTRPCRouter({
  uploadPhoto: privateProcedure.mutation(async ({ ctx }) => {
    const { id: photoId } = await ctx.prisma.photo.create({
      data: { userId: ctx.userId },
    });
    return s3.createPresignedPost({
      Bucket: "training-manager",
      Fields: {
        key: photoId,
      },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, 10000000],
      ],
      Expires: 30,
    });
  }),
  getPhotos: privateProcedure.query(async ({ ctx }) => {
    const photos = await ctx.prisma.photo.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!photos) throw new TRPCError({ code: "NOT_FOUND" });
    return photos;
  }),
  deletePhoto: privateProcedure
    .input(
      z.object({
        photoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.photo.delete({
        where: {
          id: input.photoId,
        },
      });
      if (!res) throw new TRPCError({ code: "NOT_FOUND" });
      return {};
    }),
});
