import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

import {AiOutlineClose} from 'react-icons/ai'

// Component Imports
import MatchCard from "../components/MatchComponents/MatchCard";
import CreateMatch from "../components/MatchComponents/CreateMatch";

// Hooks
import useUiStore from "../utils/hooks/uiStore";
import Link from "next/link";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const showCreateMatchModal = useUiStore((state) => state?.createMatchModal)

  return (
    <>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-10 w-full">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Ultimate <span className="text-[hsl(280,100%,70%)]">Ladder</span>
          </h1>
          <div className="flex flex-col items-center gap-4 w-full">
            {session ? (
              <>
              <UserMatch/>
              <Matches />
              </>
            ) : null}
          </div>
        </div>
        {showCreateMatchModal ? (
          <CreateMatch/>
        ) : null}
    </>
  );
};

export default Home;

const Matches: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: matches, refetch: refetchMatches  } = trpc.match.getAllMatches.useQuery(undefined, {refetchInterval: 10000})
  const toggleModal = useUiStore((state) => state?.toggleCreateMatchModal);

  return (
    <div className='w-full bg-black/10 p-4 rounded-md'>
      <div className='w-full flex justify-between items-center mb-2'>
        <h4 className='font-bold text-xl text-slate-200'>
          Open Matches
        </h4>
        <button className="btn btn-sm btn-primary" onClick={toggleModal}>
          create match
        </button>
      </div>
      {matches && matches.length > 0 ? (
        <div className='w-full grid md:grid-cols-2 gap-4'>
          {matches.map((match) => {
            const checkCreator = () => {
              if (sessionData?.user && sessionData?.user.id === match.hostId) {
                return true
              } else {
                return false
              }
            }
            const isCreator = checkCreator()
            console.log(match)
            return (
              <MatchCard key={match.id} match={match} isCreator={isCreator} refetch={refetchMatches}/>
            )
          })}
        </div>
      ) : (
        <div className='p-4 bg-black/10 rounded-md'>
          No Matches Available
        </div>
      )}
    </div>
  )
};

const UserMatch: React.FC = () => {
  const router = useRouter();
  const {data: match, refetch: refetchMatch} = trpc.match.getUserActiveMatch.useQuery(undefined, {refetchInterval: 5000});
  const closeMatch = trpc.match.closeMatch.useMutation();
  const deleteMatch = trpc.match.deleteMatch.useMutation();
  return (
    <>
      {match?.id ? (        
        <div className='w-full rounded-md bg-slate-900 hover:scale-[102%] hover:bg-slate-900/80 transition-all p-4'>
          <div className='flex justify-between'>
            <h4 className='text-xl text-center font-bold text-gray-200'>
              {match?.joinable ? "Searching..." : (
                <span>
                  vs {" "}
                  <span className='text-accent'>
                    {match?.guestName}
                  </span>
                </span>
              )}
            </h4>
            <div className='flex gap-2'>
              <button className='btn btn-sm btn-accent' onClick={() => router.push(`/matches/${match.id}`)}>
                Rejoin
              </button>
              {match?.joinable ? (
                <button className={`btn btn-ghost btn-square btn-sm ${deleteMatch.isLoading && 'loading'}`} onClick={ async () => {
                  const result = await deleteMatch.mutateAsync({id: match?.id})
                  if (result) {
                    refetchMatch()
                  }
                }}>
                  {!deleteMatch.isLoading && (
                    <AiOutlineClose />
                  )}
                </button>
              ) : (
                <button className='btn btn-ghost btn-square btn-sm' onClick={ async () => {
                    const result = await closeMatch.mutateAsync({id: match?.id})
                    if (result) {
                      refetchMatch()
                    }
                }}>
                  <AiOutlineClose />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}