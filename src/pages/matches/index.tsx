import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import type { Match } from "@prisma/client";

const Matches: NextPage = () => {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        
      </main>
  );
};

export default Matches;
