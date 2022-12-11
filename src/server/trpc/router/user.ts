import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    getUser: publicProcedure
        .input(z.object({id: z.string().or(z.string().array().optional())}))
        .query(async ({ctx, input}) => {
            if (typeof input.id === "string"){
                return await ctx.prisma.user.findUnique({where: {id: input.id}})
            }
        })
})