import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Accounts } from "../components/Accounts";
import { Layout } from "../components/Layout";
import { ProtectedPage } from "../types";

interface Props {}

const AccountsPage: ProtectedPage<Props> = () => {
  const { data } = useSession();
  const { user } = data || {};

  const layoutProps = { user };

  return (
    <>
      <Head>
        <title>Instaccounts - Select Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <Accounts />
      </Layout>
    </>
  );
};

AccountsPage.isProtected = true;

export default AccountsPage;
