import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { pusherServerClient } from "../../helpers/pusher";

export const messageRouter = router({
    getMessages: publicProcedure
        .input(z.object({ matchId: z.string() }))
        .query(async ({ctx, input}) => {
            const messages = await ctx.prisma.message.findMany({
                where: {
                    matchId: input.matchId
                }
            })
            if (messages.length >= 1) {
                const sorted = messages.sort((a, b) => {
                    return b.created.getTime() - a.created.getTime();
                })
                return sorted
            }
            return messages
        }),
    createMessage: protectedProcedure
        .input(z.object({ matchId: z.string(), host: z.boolean(), content: z.string() }))
        .mutation(async ({ctx, input}) => {
            const match = await ctx.prisma.match.findUnique({
                where: {
                    id: input.matchId
                }
            })
            if (match) {
                const message = await ctx.prisma.message.create({
                    data: {
                        userId: ctx.session.user.id,
                        matchId: input.matchId,
                        content: input.content,
                        host: (match.hostId === ctx.session.user.id)
                    }
                })
                await pusherServerClient.trigger(
                    `match-${input.matchId}`,
                    'new-message',
                    message
                  );
                return message
            }
        })
})