import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

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
  updateWeight: privateProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.weight.create({
        data: { weight: input, userId: ctx.userId },
      });
    }),
  updateKcal: privateProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.kcal.create({
        data: { kcal: input, userId: ctx.userId },
      });
    }),
});
