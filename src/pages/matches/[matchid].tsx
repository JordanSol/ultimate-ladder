import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import ManageRound from "../../components/MatchComponents/ManageRound";

const Match: NextPage = () => {
    const [isHost, setIsHost] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const {matchid} = router.query;
    const {data: match} = trpc.match.getMatch.useQuery({id: matchid});

    useEffect(() => {
        if (session?.user?.id === match?.hostId) {
            setIsHost(true)
        }
        if (session?.user?.id === match?.guestId) {
            setIsGuest(true)
        }
    }, [match, session?.user?.id])

    return (
        <main>
            {session ? (
                <>
                    <h1 className="text-3xl text-center font-extrabold tracking-tight text-white sm:text-[2.5rem] mb-4">
                        {match?.joinable ? "Searching..." : "vs "}
                        <span className="text-[hsl(280,100%,70%)]">
                            {!match?.joinable && (
                                <>
                                    {isHost && `${match?.guestName}`}
                                    {!isHost && `${match?.hostName}`}
                                </>
                                
                            )}
                        </span>
                    </h1>
                    {isHost || isGuest ? (
                        <div className='bg-slate-900 rounded-md py-4 px-8 md:px-16 text-gray-200 shadow-lg'>
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