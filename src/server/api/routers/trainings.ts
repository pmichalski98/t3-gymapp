import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const exerciseSchema = z.object({
  id: z.string().uuid(),
  trainingId: z.string().uuid(),
  label: z.string(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number(),
});

const trainingUnitSchema = z.object({
  trainingId: z.string().uuid(),
  label: z.string(),
  createdAt: z.date(),
  endedAt: z.date(),
  exercises: z.array(exerciseSchema.omit({ id: true })),
});

const trainingSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  exercises: z.array(exerciseSchema),
  trainingUnits: z.array(trainingUnitSchema).optional(),
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
  finishTrainingUnit: privateProcedure
    .input(trainingUnitSchema)
    .mutation(async ({ ctx, input }) => {
      const trainingUnit = await ctx.prisma.trainingUnit.create({
        data: {
          createdAt: input.createdAt,
          endedAt: input.endedAt,
          label: input.label,
          trainingId: input.trainingId,
          exercises: {
            createMany: { data: input.exercises },
          },
        },
      });
      if (!trainingUnit) throw new TRPCError({ code: "BAD_REQUEST" });
      return { affectedRecords: 1 };
    }),
  getAllTrainingUnits: privateProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const trainingUnits = await ctx.prisma.trainingUnit.findMany({
        where: { trainingId: input },
        include: { exercises: true, training: true },
      });
      if (!trainingUnits) throw new TRPCError({ code: "NOT_FOUND" });
      return trainingUnits;
    }),
  startTraining: privateProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const trainingUnit = await ctx.prisma.trainingUnit.findFirst({
        where: { trainingId: input },
        include: { exercises: true },
      });
      if (!trainingUnit) {
        return ctx.prisma.training.findUnique({
          where: { id: input },
          include: { exercises: true },
        });
      }
      return trainingUnit;
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
    const trainings = await ctx.prisma.training.findMany({
      where: { userId: ctx.userId },
    });
    if (!trainings) throw new TRPCError({ code: "NOT_FOUND" });
    return trainings;
  }),
});
