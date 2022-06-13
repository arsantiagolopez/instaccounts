import { appInfo as InstafeedAppInfo } from "instaccounts-instafeed";
import React, { FC, ReactNode, useEffect, useState } from "react";
import useSWR from "swr";
import { App } from "../types";
import { handleMutation } from "../utils/handleMutation";
import { AppContext } from "./AppContext";

interface Props {
  children: ReactNode;
}

const AppProvider: FC<Props> = ({ children }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [creatingDefault, setCreatingDefault] = useState<boolean>(false);

  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/apps`);

  const downloadDefaultApp = async (): Promise<void> => {
    setCreatingDefault(true);
    const instafeedAppInfo = InstafeedAppInfo;
    const { data } = await handleMutation("/apps", instafeedAppInfo);
    setApps([...apps, data]);
  };

  useEffect(() => {
    if (data) {
      const defaultAppExistsOnDb = data.find(
        ({ name }: App) => name.toLowerCase() === "instagram feed"
      );

      // Create default app instace on db
      if (data && !defaultAppExistsOnDb && !creatingDefault) {
        downloadDefaultApp();
        return;
      }

      setApps(data);
    }
  }, [data]);

  return (
    <AppContext.Provider
      value={{
        apps,
        setApps,
        mutate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
