import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const trainingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.training.findMany();
  }),
});
