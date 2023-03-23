import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import zod from "zod";

export const trainingsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      zod.object({
        content: zod.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.training.findMany({
        where: { userId: input.content },
      });
    }),
});
