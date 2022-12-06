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
    const { mutate, error } = trpc.match.deleteMatch.useMutation({onSuccess: () => {setDeleted(true)}})
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
                        <button className='btn btn-sm mt-1' onClick={() => mutate({id: match.id})}>
                            Cancel Search
                        </button>
                    ) : null}
                </div>
            )}
        </>
    )
}

export default MatchCard