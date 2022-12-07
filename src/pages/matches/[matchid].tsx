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
            {isHost || isGuest ? (
                <div>
                    <p>Match Host: {match?.hostName}</p>
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
        </main>
    )
}

export default Match