import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import { rating, rate, ordinal } from 'openskill'

export const userRouter = router({
    getUser: publicProcedure
        .input(z.object({id: z.string().or(z.string().array().optional())}))
        .query(async ({ctx, input}) => {
            if (typeof input.id === "string"){
                return await ctx.prisma.user.findUnique({where: {id: input.id}})
            }
        }),
    initRating: protectedProcedure
        .mutation(async ({ctx}) => {
            const newRating = rating()
            const ordinalRating = ordinal(newRating)
            await ctx.prisma.rating.create({
                data: {
                    userId: ctx.session.user.id,
                    mu: newRating.mu,
                    sigma: newRating.sigma,
                    ordinal: ordinalRating
                }
            }).then(async (result) => {
                await ctx.prisma.user.update({
                    where: {
                        id: ctx.session.user.id
                    },
                    data: {
                        ratingId: result.id,
                        ratingInt: result.ordinal
                    }
                })
            });
        }),
    winExample: protectedProcedure
        .mutation(async ({ctx}) => {
            const fakeRating = rating();
            const userRating = await ctx.prisma.rating.findUnique({where: {
                userId: ctx.session.user.id
            }});
            if (userRating) {
                const updated = rate([[userRating], [fakeRating]], {rank: [1,2]});
                const newRating = updated[0]
                if (newRating && newRating[0] !== undefined) {
                    const newOrdinal = ordinal(newRating[0])
                    await ctx.prisma.rating.update({
                        where: {
                            userId: ctx.session.user.id
                        }, 
                        data: {
                            mu: newRating[0].mu,
                            sigma: newRating[0].sigma,
                            ordinal: newOrdinal
                        }
                    }).then(async (result) => {
                        await ctx.prisma.user.update({
                            where: {
                                id: ctx.session.user.id
                            },
                            data: {
                                ratingInt: newOrdinal
                            }
                        })
                    })
                }
            }
        })
})