import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { Settings } from "../components/Settings";
import { ProtectedPage } from "../types";

interface Props {}

const SettingsPage: ProtectedPage<Props> = () => {
  const { data } = useSession();
  const { user } = data || {};

  const title = "Instaccounts - Settings";
  const layoutProps = { user };

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <Settings />
      </Layout>
    </>
  );
};

export default SettingsPage;
