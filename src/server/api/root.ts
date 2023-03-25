import { createTRPCRouter } from "~/server/api/trpc";
import { trainingsRouter } from "~/server/api/routers/trainings";
import { usersRouter } from "~/server/api/routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trainings: trainingsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
