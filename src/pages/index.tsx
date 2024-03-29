import { type NextPage } from "next";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { AnimatePresence } from "framer-motion";
import {AiOutlineClose} from 'react-icons/ai';

// Component Imports
import MatchCard from "../components/MatchComponents/MatchCard";
import CreateMatch from "../components/MatchComponents/CreateMatch";

// Hooks
import useUiStore from "../utils/hooks/uiStore";
import usePusherStore from "../utils/hooks/pusherStore";
import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/router";
import type { Match } from "@prisma/client";
import LoadingSpinner from "../components/Spinner";

interface MatchesProps {
  matches: Match[] | undefined;
  activeMatch: boolean;
  isLoading: boolean;
  refetchMatches: () => void;
}

interface UserMatchProps {
  match: Match;
  refetchMatch: () => void;
  refetchMatches: () => void;
}

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { data: userMatches, refetch: refetchMatch } = trpc.match.getUserActiveMatch.useQuery();
  const { data: matches, refetch: refetchMatches, isLoading } = trpc.match.getAllMatches.useQuery();
  const showCreateMatchModal = useUiStore((state) => state?.createMatchModal);
  const pusher = usePusherStore(state => state.pusher);

  useEffect(() => {
    pusher.signin();
    const matches = pusher.subscribe('matches');
    matches.bind('new-match', refetchMatches);
    matches.bind('delete-match', () => {
      refetchMatches();
      refetchMatch();
    });
  }, []);

  return (
    <>
        <div className="container flex flex-col items-center justify-center gap-12 w-full page">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center">
            Ultimate <span className="text-[hsl(280,100%,70%)]">Ladder</span>
          </h1>
          <div className="flex flex-col items-center gap-4 w-full h-full grow">
            {session ? (
              <>
              {userMatches?.map(match => (
                <UserMatch key={match.id} match={match} refetchMatch={refetchMatch} refetchMatches={refetchMatches}/>
              ))}
              <Matches matches={matches} refetchMatches={refetchMatches} activeMatch={userMatches && userMatches?.length > 0 ? true : false} isLoading={isLoading}/>
              </>
            ) : null}
          </div>
        </div>
        <AnimatePresence>
        {showCreateMatchModal ? (
            <CreateMatch/>
            ) : null}
        </AnimatePresence>
    </>
  );
};

export default Home;

const Matches: React.FC<MatchesProps> = ({matches, activeMatch, isLoading, refetchMatches}) => {
  const { data: sessionData } = useSession();
  const toggleModal = useUiStore((state) => state?.toggleCreateMatchModal);

  return (
    <div className='w-full bg-black/10 p-4 rounded-md'>
      {isLoading ? (
        <LoadingSpinner/>
      ) : (
        <>
        <div className='w-full flex justify-between items-center mb-2'>
          <h4 className='font-bold text-xl text-slate-200'>
            Open Matches
          </h4>
          <button className="btn btn-sm btn-primary" onClick={toggleModal} disabled={activeMatch}>
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
              };
              const isCreator = checkCreator()
              return (
                <MatchCard key={match.id} match={match} isCreator={isCreator} refetch={refetchMatches}/>
              )
            })}
          </div>
        ) : (
          <div className='opacity-70'>
            No Matches Available
          </div>
        )}
        </>
      )}
    </div>
  )
};

const UserMatch: React.FC<UserMatchProps> = ({match, refetchMatch, refetchMatches}) => {
  const { data: session } = useSession()
  const [isHost, setIsHost] = useState(false);
  const router = useRouter();
  const closeMatch = trpc.match.closeMatch.useMutation();
  const deleteMatch = trpc.match.deleteMatch.useMutation();


  useEffect(() => {
    if (session?.user?.id === match?.hostId) {
      setIsHost(true);
    }
  }, [session, match]);


  return (
    <>
      {match?.id ? (        
        <div className='w-full rounded-md bg-slate-900 hover:scale-[102%] hover:bg-slate-900/80 transition-all p-4 shadow-md'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-wrap gap-2 items-center '>
              <h4 className='text-xl text-center font-bold text-gray-200 inline-block'>
                {match?.joinable ? <div>
                  Searching <button disabled className='btn !bg-transparent btn-xs btn-square loading' />
                </div> : (
                  <span>
                    vs {" "}
                    <span className='text-accent'>
                      {isHost ? match?.guestName : match?.hostName}
                    </span>
                  </span>
                )}
              </h4>
              <span className='opacity-60 italic text-sm'>
                  {match.ranked ? "Ranked" : "Friendlies"}
              </span>
              {match.guestId && (
                <>                  
                  <span className='opacity-60 italic text-sm'>
                      W: <span className='text-success'>{isHost ? `${match.hostScore}` : `${match.guestScore}`}</span>
                  </span>
                  <span className='opacity-60 italic text-sm'>
                      L: <span className='text-error'>{isHost ? `${match.hostScore}` : `${match.guestScore}`}</span>
                  </span>

                </>
              )}
            </div>
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
                      refetchMatches()
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