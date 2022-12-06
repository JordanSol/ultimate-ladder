import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { EventEmitter } from "events";

import { trpc } from "../../../utils/trpc";
import { Character } from "@prisma/client";

const ee = new EventEmitter();

export const matchRouter = router({
    createMatch: protectedProcedure
      .input(z.object({ character: z.nativeEnum(Character)}))
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
                hostCharacter: input.character
            }
        })
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
    getUserMatches: protectedProcedure
      .query(async ({ctx}) => {
        if (!ctx.session) throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'No active authentication session, login and retry.'
        });
        try {
          const hostedMatches = await ctx.prisma.match.findMany({where: {hostId: ctx.session.user.id}});
          const joinedMatches = await ctx.prisma.match.findMany({where: {guestId: ctx.session.user.id}});
          const matches = [...hostedMatches, ...joinedMatches];
          return matches
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching matches.'
          })
        }

      }),
    getAllMatches: publicProcedure
      .query(async ({ctx}) => {
        return await (await ctx.prisma.match.findMany({where: {ongoing: true}})).filter((match) => {
          if (match.joinable) {
            return match
          }
        })
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
      })
  });