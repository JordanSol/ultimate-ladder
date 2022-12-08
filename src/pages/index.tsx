import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";

// Component Imports
import MatchCard from "../components/MatchComponents/MatchCard";
import CreateMatch from "../components/MatchComponents/CreateMatch";

// Hooks
import useUiStore from "../utils/hooks/uiStore";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toggleModal = useUiStore((state) => state?.toggleCreateMatchModal);

  const showCreateMatchModal = useUiStore((state) => state?.createMatchModal)

  return (
    <>
      <Head>
        <title>Ultimate Ladder</title>
        <meta name="description" content="Smash Ultimate Ladder: By Chill?!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Ultimate <span className="text-[hsl(280,100%,70%)]">Ladder</span>
          </h1>
          <div className="flex flex-col items-center gap-4 w-full">
            {session ? (
              <>
              <div className='w-full flex justify-between items-center'>
                <h4 className='font-bold text-xl text-slate-200'>
                  Open Matches
                </h4>
                <button className="btn btn-sm btn-primary" onClick={toggleModal}>
                  create match
                </button>
              </div>
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
  const { data: matches  } = trpc.match.getAllMatches.useQuery(undefined, {refetchInterval: 10000})

  return (
    <div className='w-full max-w-[1000px]'>
      {matches && matches.length > 0 ? (
        <div className='w-full grid md:grid-cols-2 gap-4 bg-black/10 p-4 rounded-md'>
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
              <MatchCard key={match.id} match={match} isCreator={isCreator}/>
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
}