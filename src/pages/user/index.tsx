import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import type { Match } from "@prisma/client";

const User: NextPage = () => {
    const router = useRouter()
    const {data: session} = useSession();

    useEffect(() => {
        if (session?.user?.id) {
            router.push(`/user/${session.user.id}`)
        } else {
            router.push("/api/signin")
        }
    }, [session?.user?.id, router])
    return (
        <main className="flex flex-col items-center justify-center">
            
        </main>
    );
};

export default User;
