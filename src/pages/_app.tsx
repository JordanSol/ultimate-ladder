import { type AppType } from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query" 

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const queryClient = new QueryClient();
    
  return (
    <>
    <Head>
    <title>Ultimate Ladder</title>
    <meta name="description" content="Smash Ultimate Ladder: By Chill?!" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="../../manifest.json"></link>
    </Head>
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
