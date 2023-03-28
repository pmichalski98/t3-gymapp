import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const exerciseSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number(),
});

const trainingSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  exercises: z.array(exerciseSchema),
  trainingUnits: z
    .array(
      z.object({
        id: z.string().uuid(),
        date: z.date(),
        exercises: z.array(exerciseSchema),
      })
    )
    .optional(),
});

export const trainingsRouter = createTRPCRouter({
  addTraining: privateProcedure
    .input(
      z.object({
        label: z.string(),
        exercises: z.array(exerciseSchema.pick({ label: true })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.training.create({
        data: {
          label: input.label,
          exercises: { createMany: { data: input.exercises } },
          userId: ctx.userId,
        },
      });
    }),
  editTraining: privateProcedure
    .input(trainingSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.training.update({
        where: { id: input.id },
        data: {
          label: input.label,
          exercises: {
            deleteMany: {
              trainingId: input.id,
            },
            createMany: { data: input.exercises },
          },
        },
        include: { exercises: true },
      });
    }),
  deleteByid: privateProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.prisma.training.delete({
        where: { id: input },
      });
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return deleted;
    }),
  getById: privateProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const training = await ctx.prisma.training.findUnique({
        where: { id: input },
        include: { exercises: true },
      });
      if (!training) throw new TRPCError({ code: "NOT_FOUND" });
      return training;
    }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
    });
    if (!user) {
      await ctx.prisma.user.create({ data: { id: ctx.userId } });
    }
    const trainings = await ctx.prisma.training.findMany({
      where: { userId: ctx.userId },
    });
    if (!trainings) throw new TRPCError({ code: "NOT_FOUND" });
    return trainings;
  }),
});
