import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { matchRouter } from "./match";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  data: exampleRouter,
  match: matchRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
