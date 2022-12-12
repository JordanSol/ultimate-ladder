import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { EventEmitter } from "events";

import { BansFirst, Character, type Match, Stage } from "@prisma/client";

const ee = new EventEmitter();

export const matchRouter = router({
    createMatch: protectedProcedure
      .input(z.object({ arenaId: z.string(), arenaPw: z.string()}))
      .mutation(async ({ctx, input}) => {
        if (!ctx.session) throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No active authentication session, login and retry.'
        });
        await ctx.prisma.match.deleteMany({where: {hostId: ctx.session.user.id, joinable: true}})
        return await ctx.prisma.match.create({
            data: {
                hostId: ctx.session.user.id,
                hostName: ctx.session.user.name,
                arenaId: input.arenaId,
                arenaPw: input.arenaPw
            }
        })
      }),

    joinMatch: protectedProcedure
      .input(z.object({ matchId: z.string()}))
      .mutation(async ({ctx, input}) => {
        if (!ctx.session) throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No active authentication session, login and retry.'
        });
        const match = await ctx.prisma.match.findUnique({where: {id: input.matchId}});
        if (match?.joinable) {
          const update = await ctx.prisma.match.update({where: {id: input.matchId}, data: {guestId: ctx.session.user.id, guestName: ctx.session.user.name, joinable: false }});
          if (update && update.ongoing) {
            const round = match.hostScore + match.guestScore + 1;
            const bansFirst = () => {
              if (round === 1) {
                const rand = Math.floor(Math.random() * 2) + 1;
                if (rand === 1) return BansFirst.HOST
                if (rand === 2) return BansFirst.GUEST
              }
              if (match.hostScore > match.guestScore) {
                return BansFirst.HOST
              }
              if (match.guestScore > match.hostScore) {
                return BansFirst.GUEST
              }
            }
            await ctx.prisma.round.create({
              data: {
                matchId: input.matchId,
                roundNumber: round,
                bansFirst: bansFirst()
              }
            })
          }
          return update
        } else {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Another player already joined this match.'
          })
        }
      }),

    createRound: protectedProcedure
      .input(z.object({ matchId: z.string() }))
      .mutation(async ({ctx, input}) => {
        if (!ctx.session) throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No active authentication session, login and retry.'
        });
        const match: Match | null = await ctx.prisma.match.findUnique({where: {id: input.matchId}});
        if (match?.ongoing) {
          const round = match.hostScore + match.guestScore + 1;
          const bansFirst = () => {
            if (round === 1) {
              const rand = Math.floor(Math.random() * 2) + 1;
              if (rand === 1) return BansFirst.HOST
              if (rand === 2) return BansFirst.GUEST
            }
            if (match.hostScore > match.guestScore) {
              return BansFirst.HOST
            }
            if (match.guestScore > match.hostScore) {
              return BansFirst.GUEST
            }
          }
          return await ctx.prisma.round.create({
            data: {
              matchId: input.matchId,
              roundNumber: round,
              bansFirst: bansFirst()
            }
          })
        }
      }),

    banStages: protectedProcedure
      .input(z.object({ ban1: z.nativeEnum(Stage), ban2: z.nativeEnum(Stage), roundId: z.string()}))
      .mutation(async ({input, ctx}) => {
        return await ctx.prisma.round.update({where: {id: input.roundId}, data: {
          ban1: input.ban1,
          ban2: input.ban2
        }})
      }),
    
    pickStage: protectedProcedure
      .input(z.object({stage: z.nativeEnum(Stage), roundId: z.string()}))
      .mutation(async ({input, ctx}) => {
        const round = await ctx.prisma.round.findUnique({where: {id: input.roundId}});
        if (round?.ban1 !== null && round?.ban2 !== null) {
          return await ctx.prisma.round.update({where: {id: input.roundId}, data: {
            stage: input.stage
          }})
        }
      }),

    pickCharacter: protectedProcedure
      .input(z.object({character: z.nativeEnum(Character), roundId: z.string(), matchId: z.string()}))
      .mutation( async ({ctx, input}) => {
        const match = await ctx.prisma.match.findUnique({where: {id: input.matchId}});
        try {
          if (match?.hostId === ctx.session.user.id) {
            await ctx.prisma.round.update({where: {id: input.roundId}, data: {
              hostChar: input.character
            }})
            return true
          }
          if (match?.guestId === ctx.session.user.id) {
            await ctx.prisma.round.update({where: {id: input.roundId}, data: {
              guestChar: input.character
            }})
            return true
          }
        } catch (e) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to pick a character."
          })
        }
      }),

    deleteMatch: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({input, ctx}) => {
        const result = await ctx.prisma.match.delete({
            where: {
                id: input.id
            }
        })

        return {deleted: result}
      }),

    closeMatch: protectedProcedure
      .input(z.object({ id: z.string()}))
      .mutation(async ({ctx, input}) => {
        const result = await ctx.prisma.match.update({
          where: {
            id: input.id
          },
          data: {
            ongoing: false,
            completed: true
          }
        })

        return {updated: result}
      }),

    getUserMatches: publicProcedure
      .input(z.object({ id: z.string().or( z.string().array().optional())}))
      .query(async ({ctx, input}) => {
        try {
          if (typeof input.id === "string") {            
            const hostedMatches = await ctx.prisma.match.findMany({where: {hostId: input.id, ongoing: false, joinable: false}});
            const joinedMatches = await ctx.prisma.match.findMany({where: {guestId: input.id, ongoing: false, joinable: false}});
            const matches = [...hostedMatches, ...joinedMatches];
            function sortByDate(a: Match, b: Match): number {
              return new Date(b.created).getTime() - new Date(a.created).getTime();
            }

            const sortedMatches = matches.sort(sortByDate)

            return sortedMatches
          }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching matches.'
          })
        }
      }),

    getUserActiveMatch: protectedProcedure
      .query(async ({ctx}) => {
        const hosted = await ctx.prisma.match.findMany({where: {hostId: ctx.session.user.id, ongoing: true}})
        const joined = await ctx.prisma.match.findMany({where: {guestId: ctx.session.user.id, ongoing: true}})
        return [...hosted, ...joined]
      }),

    getAllMatches: publicProcedure
      .query(async ({ctx}) => {
        return await (await ctx.prisma.match.findMany({where: {ongoing: true, joinable: true}}))
      }),

    getMatch: protectedProcedure
      .input(z.object({id: z.string().or(z.string().array().optional())}))
      .query(async ({input, ctx}) => {
        if (!ctx.session) throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No active authentication session, login and retry.'
        });
        if (typeof input.id === "string") {
          return await ctx.prisma.match.findUnique({where: {id: input.id}})
        }
      }),

    getRound: protectedProcedure
      .input(z.object({matchId: z.string(), round: z.number()}))
      .query(async ({ctx, input}) => {
        if (!ctx.session) throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'No active authentication session, login and retry.'
        });
        const round = await ctx.prisma.round.findFirst({where: {matchId: input.matchId, roundNumber: input.round}})
        if (round !== null) {
          return round
        } else {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Round does not exist.'
          });
        }
      })
  });