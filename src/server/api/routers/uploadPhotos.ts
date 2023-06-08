import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { S3 } from "aws-sdk";
import { z } from "zod";

const s3 = new S3({
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  region: "eu-central-1",
});
export const uploadPhotosRouter = createTRPCRouter({
  uploadPhoto: privateProcedure.mutation(async ({ ctx }) => {
    return s3.createPresignedPost({
      Bucket: "training-manager",
      Fields: {
        key: "imageId",
      },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, 1000000],
      ],
      Expires: 30,
    });
    // const res = await s3
    //   .putObject({
    //     Bucket: "training-manager",
    //     Body: Buffer.from(input, "base64"),
    //     Key: ctx.userId,
    //     ContentEncoding: "buffer",
    //     ContentType: "image/gif",
    //   })
    //   .promise();
  }),
});
