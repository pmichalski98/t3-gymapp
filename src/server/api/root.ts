import { createTRPCRouter } from "~/server/api/trpc";
import { trainingsRouter } from "~/server/api/routers/trainings";
import { usersRouter } from "~/server/api/routers/users";
import { photosRouter } from "~/server/api/routers/photos";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trainings: trainingsRouter,
  users: usersRouter,
  photos: photosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
