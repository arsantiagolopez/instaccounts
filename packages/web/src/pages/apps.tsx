import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { AppStore } from "../components/AppStore";
import { Layout } from "../components/Layout";
import { ProtectedPage } from "../types";

interface Props {}

const AppsPage: ProtectedPage<Props> = () => {
  const { data } = useSession();
  const { user } = data || {};

  const layoutProps = { user };
  const appStoreProps = {};

  return (
    <>
      <Head>
        <title>App Store</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout {...layoutProps}>
        <AppStore {...appStoreProps} />
      </Layout>
    </>
  );
};

AppsPage.isProtected = true;

export default AppsPage;
