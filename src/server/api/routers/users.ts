import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  login: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) throw new Error("User not authorized");
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
    });
    if (!user) {
      return ctx.prisma.user.create({ data: { id: ctx.userId } });
    }
    return user;
  }),
  getUserMeasurements: privateProcedure.query(async ({ ctx }) => {
    const userMeasurements = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { body: true, kcal: true, weight: true },
    });
    if (!userMeasurements) return null;
    return userMeasurements;
  }),
});
