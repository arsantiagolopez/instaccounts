import { ChakraProvider } from "@chakra-ui/react";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";
import "reflect-metadata";
import { SWRConfig } from "swr";
import axios from "../axios";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppProvider } from "../context/AppProvider";
import theme from "../theme";

interface IsProtectedProp {
  isProtected?: boolean;
}

// Custom type to override Component type
type AppProps<P = any> = {
  Component: NextComponentType<NextPageContext, any, {}> & IsProtectedProp;
} & Omit<NextAppProps<P>, "Component">;

const MyApp: NextPage<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <SWRConfig
      value={{
        fetcher: (url) => axios(url).then((res) => res.data),
      }}
    >
      <ChakraProvider theme={theme}>
        <AppProvider>
          {Component.isProtected ? (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </AppProvider>
      </ChakraProvider>
    </SWRConfig>
  </SessionProvider>
);

export default MyApp;
