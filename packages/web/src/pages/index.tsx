import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { Dashboard } from "../components/Dashboard";
import { Layout } from "../components/Layout";
import { LoadingScreen } from "../components/Screens";
import { Signin } from "../components/Signin";
import { ProtectedPage } from "../types";

interface Props {}

const IndexPage: ProtectedPage<Props> = () => {
  const { data, status } = useSession();
  const loading: boolean = status === "loading";
  const { user } = data || {};

  let title: string | undefined;
  let content: JSX.Element | undefined;

  const layoutProps = { user };

  if (!user) {
    title = "- Sign in";
    content = <Signin />;
  } else {
    content = (
      <Layout {...layoutProps}>
        <Dashboard />
      </Layout>
    );
  }

  if (loading) {
    return <LoadingScreen isFullScreen />;
  }

  return (
    <>
      <Head>
        <title>Instaccounts {title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {content}
    </>
  );
};

export default IndexPage;
