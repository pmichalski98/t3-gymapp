import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const trainingsRouter = createTRPCRouter({
  // @TODO maybe i need to change this to private procedure
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.training.findMany({
      where: { userId: ctx.userId },
    });
  }),
});
