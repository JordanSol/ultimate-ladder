import type {FC} from 'react'
import {useState, useEffect} from 'react'
import type { Match } from '@prisma/client'
import { trpc } from "../../utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {characters, findCharacter} from '../../lib/characters';
import { useRouter } from 'next/router';

interface MatchCardProps {
    match: Match,
    isCreator: boolean,
    refetch: () => void
}

interface ElapsedTimeProps {
    time: Date
}

const MatchCard: FC<MatchCardProps> = ({match, isCreator, refetch}) => {
    const router = useRouter();
    const [deleted, setDeleted] = useState(false);
    const deleteMatch = trpc.match.deleteMatch.useMutation({onSuccess: () => {setDeleted(true)}});
    const joinMatch = trpc.match.joinMatch.useMutation({onSuccess: (data) => router.push(`/matches/${data?.id}`)});

    // const getElapsedTime = (currTime) => {

    // }
    return (
        <>
            {!deleted && (
                <div className="bg-slate-900 text-white/90 px-10 py-6 rounded-md flex flex-col gap-1 w-full hover:scale-[102%] transition-all">
                    <p className='font-bold text-xl'>
                        vs. <span className='text-accent font-normal'>{match.hostName}</span>
                    </p>
                    <div>
                        <ElapsedTime time={match.created}/>
                    </div>
                    {!isCreator && match.joinable ? (
                        <button className='btn btn-sm btn-secondary btn-outline mt-1' onClick={() => joinMatch.mutate({matchId: match.id})}>
                            Join Match
                        </button>
                    ) : null}
                </div>
            )}
        </>
    )
}

const ElapsedTime: FC<ElapsedTimeProps> = ({time}) => {
    const [elapsed, setElapsed] = useState({hours: 0, minutes: 0, seconds: 0});
    const getTime = () => {
        const now = Date.now()
        let elapsedTime = now - time.getTime() 
        elapsedTime /= 1000
        const hours = Math.round(Math.floor(elapsedTime / 3600));
        elapsedTime -= hours * 3600;
        const minutes = Math.round(Math.floor(elapsedTime / 60));
        elapsedTime -= minutes * 60;
        return {hours, minutes, seconds: Math.round(elapsedTime)};
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(getTime())
        });
        return () => clearInterval(interval)
    }, [])
    return (
        <>
        <span className=''>Started </span>
            <span className='text-accent'>{elapsed.hours < 10 && 0}{elapsed.hours}:{elapsed.minutes < 10 && 0}{elapsed.minutes}:{elapsed.seconds < 10 && 0}{elapsed.seconds}</span>
        <span className=''> Ago</span>
        </>
    )
}

export default MatchCard