import { type PrismaClient } from "@prisma/client";
import { rate, ordinal } from 'openskill'

export const reportMatch = async (winner: string, loser: string, prisma: PrismaClient) => {
    const winnerData = await prisma.user.findUnique({where: {id: winner}});
    const loserData = await prisma.user.findUnique({where: {id: loser}});
    const winnerRating = await prisma.rating.findUnique({where: {userId: winner}});
    const loserRating = await prisma.rating.findUnique({where: {userId: winner}});
    if (winnerRating && loserRating && winnerData && loserData) {
        const [winningTeam, losingTeam] = rate(
            [
                [
                    {mu: winnerRating?.mu, sigma: winnerRating?.sigma}
                ], 
                [
                    {mu: loserRating.mu, sigma: loserRating.sigma}
                ]
            ]
        );
        if (winningTeam && losingTeam) {
            const updatedWinner = winningTeam[0];
            const updatedLoser = losingTeam[0];
            let winnerOrdinal: number = winnerRating.ordinal;
            let loserOrdinal: number = loserRating.ordinal;
            if (updatedWinner && updatedLoser) {
                winnerOrdinal = ordinal(updatedWinner);
                loserOrdinal = ordinal(updatedLoser);
            }
            let winnerWins = 1;
            let winnerLosses = 0;
            let loserWins = 0;
            let loserLosses = 1;
            if (winnerData.wins !== null && winnerData.losses !== null) {
                winnerWins = winnerData.wins ++;
                winnerLosses = winnerData.losses;
            }
            if (loserData.wins !== null && loserData.losses !== null) {
                loserWins = loserData.wins;
                loserLosses = loserData.losses ++;
            }

            // Update winner rating and profile
            await prisma.rating.update({
                where: {
                    userId: winner
                },
                data: {
                    mu: updatedWinner?.mu,
                    sigma: updatedWinner?.sigma,
                    ordinal: winnerOrdinal
                }
            }).then(async (result) => {
                await prisma.user.update({
                    where: {
                        id: winner
                    },
                    data: {
                        ratingInt: result.ordinal,
                        wins: winnerWins,
                        winRate: (winnerWins / winnerLosses) * 100
                    }
                })
            });

            // Update loser rating and profile
            await prisma.rating.update({
                where: {
                    userId: loser
                },
                data: {
                    mu: updatedLoser?.mu,
                    sigma: updatedLoser?.sigma,
                    ordinal: loserOrdinal
                }
            }).then(async (result) => {
                await prisma.user.update({
                    where: {
                        id: loser
                    },
                    data: {
                        ratingInt: result.ordinal,
                        losses: loserLosses,
                        winRate: (loserWins / loserLosses) * 100
                    }
                })
            });
        }
    }
}