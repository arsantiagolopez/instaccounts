import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Bot } from "../components/Bot";
import { Layout } from "../components/Layout";
import { ProtectedPage } from "../types";

interface Props {}

const BotPage: ProtectedPage<Props> = () => {
  const { data } = useSession();
  const { user } = data || {};

  const layoutProps = { user };

  return (
    <>
      <Head>
        <title>Instaccounts - Bot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <Bot />
      </Layout>
    </>
  );
};

BotPage.isProtected = true;

export default BotPage;
