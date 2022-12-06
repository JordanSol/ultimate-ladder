import type {FC} from 'react'
import {useState, useEffect} from 'react'
import type { Match } from '@prisma/client'
import { trpc } from "../../utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {characters, findCharacter} from '../../lib/characters';

interface MatchCardProps {
    match: Match
    isCreator: boolean
}

const MatchCard: FC<MatchCardProps> = ({match, isCreator}) => {
    const [deleted, setDeleted] = useState(false);
    const deleteMatch = (matchId: string) => {
        const { mutate, error } = trpc.match.deleteMatch.useMutation({onSuccess: () => {setDeleted(true)}})
        mutate({id: matchId})
    }
    const joinMatch = (matchId: string) => {
        const { mutate, error} = trpc.match.joinMatch.useMutation() 
        mutate({matchId: matchId})
    }
    // const getElapsedTime = (currTime) => {

    // }
    return (
        <>
            {!deleted && (
                <div className="bg-slate-300 text-gray-900 px-10 py-6">
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
                        <button className='btn btn-sm mt-1' onClick={() => deleteMatch(match.id)}>
                            Cancel Search
                        </button>
                    ) : (
                        <button className='btn btn-sm mt-1' onClick={() => joinMatch(match.id)}>
                            Join Match
                        </button>
                    )}
                </div>
            )}
        </>
    )
}

export default MatchCard