import { createContext, Dispatch, SetStateAction } from "react";
import { KeyedMutator, mutate } from "swr";
import { App } from "../types";

interface ContextState {
  // set the type of state you want to handle with context e.g.
  apps: App[];
  setApps: Dispatch<SetStateAction<App[]>>;
  mutate: KeyedMutator<App[]>;
}

const AppContext = createContext<ContextState>({
  apps: [],
  setApps: () => {},
  mutate: mutate,
});

export { AppContext };
