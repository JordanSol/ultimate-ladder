import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { matchRouter } from "./match";
import { userRouter } from "./user"

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  data: exampleRouter,
  match: matchRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
