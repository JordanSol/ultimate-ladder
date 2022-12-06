import type {FC} from 'react'
import {useState, useEffect} from 'react'
import type { Match } from '@prisma/client'
import { trpc } from "../../utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {characters, findCharacter} from '../../lib/characters';
import { useRouter } from 'next/router';

interface MatchCardProps {
    match: Match
    isCreator: boolean
}

const MatchCard: FC<MatchCardProps> = ({match, isCreator}) => {
    const router = useRouter();
    const [deleted, setDeleted] = useState(false);
    const deleteMatch = trpc.match.deleteMatch.useMutation({onSuccess: () => {setDeleted(true)}});
    const joinMatch = trpc.match.joinMatch.useMutation({onSuccess: (data) => router.push(`/matches/${data?.id}`)});

    // const getElapsedTime = (currTime) => {

    // }
    return (
        <>
            {!deleted && (
                <div className="bg-slate-100 text-gray-900 px-10 py-6 rounded-md">
                    <p>
                        VS: {match.hostName}
                    </p>
                    <p>
                        Character: {findCharacter(match.hostCharacter)}
                    </p>
                    <p>
                        Created: {match.created.toLocaleTimeString()}
                    </p>
                    {isCreator && match.joinable ? (
                        <button className='btn btn-sm mt-1' onClick={() => deleteMatch.mutate({id: match.id})}>
                            Cancel Search
                        </button>
                    ) : (
                        <button className='btn btn-sm mt-1' onClick={() => joinMatch.mutate({matchId: match.id})}>
                            Join Match
                        </button>
                    )}
                </div>
            )}
        </>
    )
}

export default MatchCard