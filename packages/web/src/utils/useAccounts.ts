import { useEffect, useState } from "react";
import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { Instagram } from "../types";

interface UseAccounts {
  accounts: Instagram[] | undefined;
  active?: Instagram;
  mutate: KeyedMutator<Instagram[]>;
}

const useAccounts = (): UseAccounts => {
  const [active, setActive] = useState<Instagram | undefined>();
  const { data: accounts, mutate }: SWRResponse<Instagram[], Error> = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/instagrams`
  );

  // Set active account to the latest active
  useEffect(() => {
    if (accounts) {
      const sorted = [...accounts].sort(
        (a, b) =>
          new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      );
      setActive(sorted[0]);
    }
  }, [accounts]);

  return { accounts, active, mutate };
};

export { useAccounts };
