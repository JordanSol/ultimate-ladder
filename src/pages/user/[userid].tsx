import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import LoadingSpinner from "../../components/Spinner";
import MatchCard from "../../components/MatchComponents/MatchCard";

const User: NextPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const {userid} = router.query;
    const {data: user, isLoading} = trpc.user.getUser.useQuery({id: userid});
    const {data: userMatches, refetch} = trpc.match.getUserMatches.useQuery({id: userid});
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        if (session?.user?.id === userid) {
            setIsUser(true);
        }
    }, [session?.user, userid])


    if (isLoading) {
        return (
            <div className="page">
                <LoadingSpinner/>
            </div>
        )
    }

    return (
        <main className="flex flex-col items-center w-full page">
            <div className='card w-full'>
                <div className='flex gap-6 items-center'>
                    {user?.image ? (
                        <div className="avatar">
                            <div className="w-20 rounded-full">
                                <Image src={user?.image} alt="User Image" width={100} height={100}/>
                            </div>
                        </div>
                    ) : null}
                    <h1 className="font-bold text-gray-100 text-3xl">{user?.name}</h1>
                </div>
            </div>
            { userMatches?.map((match) => {
                console.log(match)
                return (
                <MatchCard match={match} isCreator={false} key={match.id} refetch={refetch}/>
            )})}
            
        </main>
    )
}

export default User