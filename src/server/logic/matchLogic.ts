import { type Match, PrismaClient, type Round, type User } from "@prisma/client"; 

const prisma = new PrismaClient()

export default class MatchLogic {
    match: Match;
    host: User;
    guest?: User;
    user: User;
    rounds: () => Promise<Round[]>;

    constructor(match: Match, host: User, guest: User, user: User) {
        this.match = match;
        this.host = host;
        this.guest = guest;
        this.user = user;
        this.rounds =  async () => await prisma.round.findMany({where: {matchId: match.id}});
    }

    async createMatch(input: {arenaId: string, arenaPw: string}): Promise<Match> {
        await prisma.match.deleteMany({where: {hostId: this.user.id, joinable: true}})
        return await prisma.match.create({
            data: {
                hostId: this.user.id,
                hostName: this.user.name,
                arenaId: input.arenaId,
                arenaPw: input.arenaPw
            }
        })
    }

}