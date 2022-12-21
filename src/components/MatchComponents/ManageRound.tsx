import { type Match, type Round, type BansFirst } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { type FC, useState, useEffect } from 'react';
import { trpc } from "../../utils/trpc";
import usePusherStore from "../../utils/hooks/pusherStore";

import { characters, findCharacter } from '../../lib/characters'

interface ManageRoundProps {
    match: Match
}

const ManageRound: FC<ManageRoundProps> = ({match}) => {
    const {data: session} = useSession();
    const [roundNumber, setRoundNumber] = useState(1);
    const [character, setCharacter] = useState();
    const [isHost, setIsHost] = useState(false);
    const {data: round, refetch: refetchRound} = trpc.match.getRound.useQuery({matchId: match.id, round: roundNumber}, {onError: async () => {
        if (!match?.joinable) {
            const create = await createRound.mutateAsync({matchId: match.id})
            if (create) {
                refetchRound()
            }
        }
    }, refetchInterval: 5000});
    const createRound = trpc.match.createRound.useMutation();
    const banStages = trpc.match.banStages.useMutation();
    const pickStage = trpc.match.pickStage.useMutation();
    const pickCharacter = trpc.match.pickCharacter.useMutation();
    const pusher = usePusherStore(state => state.pusher);

    const handleOnChange = (e: any) => {
        setCharacter(e.target.value)
    };

    useEffect(() => {
        const calcRound = match.hostScore + match.guestScore + 1;
        setRoundNumber(calcRound);
        if (match.hostId === session?.user?.id) {
            setIsHost(true);
        }
        console.log("Is Host:", isHost)
    }, [match]);

    useEffect(() => {
        pusher.signin();
        const matches = pusher.subscribe(`match-${match.id}`);
        matches.bind('update-match', refetchRound);
      }, []);

    if (match.ongoing) {

        return (
            <div>
                {round && !round.hostChar && isHost ? (
                    <div>
                        <h3 className='text-lg font-bold'>
                            Pick Your Character:
                        </h3>
                        <select className="select select-bordered w-full max-w-sm" defaultValue="null" value={character} onChange={handleOnChange}>
                            <option value="null" disabled>Select A Character</option>
                            {characters.map((char) => {
                                return <option key={char.key} value={char.key}>{char.name}</option>
                            })}
                        </select>
                        <button className='btn btn-sm w-full' disabled={!character} onClick={async () => {
                            if (character) {
                                const pick = await pickCharacter.mutateAsync({character: character, matchId: match.id, roundId: round.id})
                                if (pick) {
                                    refetchRound()
                                }
                            }
                        }}>
                            Submit
                        </button>
                    </div>
                ) : null}
                {round && !round.guestChar && !isHost ? (
                    <div className=''>
                        <h3 className='text-lg font-bold'>
                            Pick Your Character:
                        </h3>
                        <select className="select select-bordered w-full max-w-sm" defaultValue="null" value={character} onChange={handleOnChange}>
                            <option value="null" disabled>Select A Character</option>
                            {characters.map((char) => {
                                return <option key={char.key} value={char.key}>{char.name}</option>
                            })}
                        </select>
                        <button className='btn btn-sm w-full' disabled={!character} onClick={async () => {
                            if (character) {
                                const pick = await pickCharacter.mutateAsync({character: character, matchId: match.id, roundId: round.id})
                                if (pick) {
                                    refetchRound()
                                }
                            }
                        }}>
                            Submit
                        </button>
                    </div>
                ) : null}
                {round && round.guestChar && round.hostChar ? (
                    <p>{match.hostName}: {findCharacter(round.hostChar)} vs. {match.guestName}: {findCharacter(round.guestChar)}</p>
                ) : null}
            </div>
        )
    } else {
        return <></>
    }
}

export default ManageRound