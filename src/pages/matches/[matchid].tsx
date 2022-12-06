import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect } from 'react'

const Match: NextPage = () => {
    const router = useRouter()
    const {matchid} = router.query
    const {data: match} = trpc.match.getMatch.useQuery({id: matchid})

    useEffect(() => {
        console.log(matchid)
    })

    return (
        <main>
            <p>Match: {match?.hostName}</p>
        </main>
    )
}

export default Match