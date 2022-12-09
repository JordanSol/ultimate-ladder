import type {FC} from 'react'
import Image from 'next/image';
import {useState, useEffect} from 'react'
import type { Match } from '@prisma/client'
import { trpc } from "../../utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {characters, findCharacter} from '../../lib/characters';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface MatchCardProps {
    match: Match,
    isCreator: boolean,
    refetch: () => void
}

interface ElapsedTimeProps {
    time: Date
}

const MatchCard: FC<MatchCardProps> = ({match, isCreator, refetch}) => {
    const {data: sessionData} = useSession();
    const router = useRouter();
    const [deleted, setDeleted] = useState(false);
    const {data: host} = trpc.user.getUser.useQuery({id: match.hostId});
    const joinMatch = trpc.match.joinMatch.useMutation({onSuccess: (data) => router.push(`/matches/${data?.id}`)});

    // const getElapsedTime = (currTime) => {

    // }
    return (
        <>
            {!deleted && (
                <div className="bg-slate-900 shadow-md text-white/90 px-6 py-6 rounded-md flex items-center gap-4 w-full hover:scale-[102%] transition-all">
                    <div className="avatar">
                        <div className="rounded-full ring-1 ring-accent ring-offset-base-100 ring-offset-2">
                            {host?.image && (
                                <Image src={host?.image} alt="User Image" width={50} height={50}/>
                            )}
                        </div>
                    </div>
                    <div className=''>
                        <p className='font-bold text-lg md:text-xl'>
                            vs. <span className='text-accent font-normal'>{match.hostName}</span>
                        </p>
                        <div className="text-sm md:text-md">
                            <ElapsedTime time={match.created}/>
                        </div>
                        {!isCreator && match.joinable ? (
                            <button className='btn btn-sm btn-accent btn-outline opacity-60 mt-1' onClick={() => joinMatch.mutate({matchId: match.id})}>
                                Join Match
                            </button>
                        ) : null}
                    </div>
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