import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { Profile } from "../components/Profile";
import { ProtectedPage } from "../types";
import { useAccounts } from "../utils/useAccounts";

interface Props {}

const ProfilePage: ProtectedPage<Props> = () => {
  const { data } = useSession();
  const { user } = data || {};

  const { active: account } = useAccounts();

  const title = account
    ? `${account?.name} (@${account?.username})`
    : "Instaccounts - Profile";

  const layoutProps = { user };
  const profileProps = { account };

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <Profile {...profileProps} />
      </Layout>
    </>
  );
};

ProfilePage.isProtected = true;

export default ProfilePage;
