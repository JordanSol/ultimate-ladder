import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import usePusherStore from "../../utils/hooks/pusherStore";

import ManageRound from "../../components/MatchComponents/ManageRound";
import LoadingSpinner from "../../components/Spinner";
import Messages from "../../components/Messages";


const Match: NextPage = () => {
    const [isHost, setIsHost] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const {matchid} = router.query;
    const {data: match, isLoading, refetch: getMatch} = trpc.match.getMatch.useQuery({id: matchid});
    const pusher = usePusherStore(state => state.pusher);


    useEffect(() => {
      pusher.signin();
      const matches = pusher.subscribe(`match-${matchid}`);
      matches.bind('update-match', getMatch);
    }, []);

    useEffect(() => {
        if (session?.user?.id === match?.hostId) {
            setIsHost(true)
        }
        if (session?.user?.id === match?.guestId) {
            setIsGuest(true)
        }
    }, [match, session?.user?.id])

    if (isLoading) {
        return (
            <div className="page">
                <LoadingSpinner/>
            </div>
        )
    }
    return (
        <main className="page h-full">
            {session ? (
                <>
                    <h1 className="text-3xl text-center font-extrabold tracking-tight text-white sm:text-[2.5rem] mb-6">
                        {match?.joinable ? "Waiting For Opponent" : "vs "}
                        <span className="text-[hsl(280,100%,70%)]">
                            {!match?.joinable && (
                                <>
                                    {isHost ? match?.guestName : match?.hostName}
                                </>
                                
                            )}
                        </span>
                    </h1>
                    {isHost || isGuest ? (
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 h-full'>
                            <div className='bg-slate-900 rounded-md py-4 px-8 md:px-16 text-gray-200 shadow-lg col-span-2'>
                                <h5 className='text-lg'>Hosted by <span className='text-accent'>{match?.hostName}</span></h5>
                                {match?.guestName && (
                                    <p>Match Guest: {match.guestName}</p>
                                )}
                                <p>Arena ID: {match?.arenaId}</p>
                                <p>Arena Password: {match?.arenaPw}</p>
                                {match !== null && match !== undefined ? (
                                    <ManageRound match={match}/>
                                ) : null}
                            </div>
                            {typeof matchid === "string" && match?.hostName && match?.guestName && <Messages matchId={matchid} isHost={isHost} hostName={match?.hostName} guestName={match?.guestName}/>}
                        </div>
                    ) : (
                        <div>
                            <p>Access Denied: Not a match participant</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                Log in to continue...
                </>
            )}
    </main>
    )
}

export default Match