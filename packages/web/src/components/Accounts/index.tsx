import { Circle, Flex, Icon, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";
import { AddAccountDrawer } from "../AddAccountDrawer";
import { NoAccountsScreen } from "../Screens";
import { Card } from "./Card";

interface Props {}

const Accounts: FC<Props> = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { accounts, active, mutate } = useAccounts();

  useEffect(() => {
    if (active) setActiveId(active?.id);
  }, [active]);

  const addAccountDrawerProps = { accounts, mutate };
  const cardProps = { activeId, setActiveId, accounts, mutate };

  return (
    <Flex {...styles.wrapper}>
      {accounts?.length ? (
        <>
          {accounts.map((account, index) => (
            <Card key={account.id ?? index} account={account} {...cardProps} />
          ))}
          <AddAccountDrawer {...addAccountDrawerProps}>
            <Flex {...styles.button}>
              <Circle {...styles.aspect}>
                <Icon as={IoAddSharp} {...styles.add} />
              </Circle>
              <Flex {...styles.account}>
                <Text {...styles.username}>Add account</Text>
              </Flex>
            </Flex>
          </AddAccountDrawer>
        </>
      ) : (
        <>
          <AddAccountDrawer {...addAccountDrawerProps}>
            <Flex {...styles.button}>
              <Icon as={IoAddSharp} {...styles.add} />
              <Flex {...styles.account}>
                <Text {...styles.username}>Add account</Text>
              </Flex>
            </Flex>
          </AddAccountDrawer>
          <Flex marginY="15vh">
            <NoAccountsScreen />
          </Flex>
        </>
      )}
    </Flex>
  );
};

export { Accounts };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    paddingX: { base: "0", md: "25vw" },
    minHeight: "calc(100vh - 3em)",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    align: "center",
    height: { base: "10vh", md: "13vh" },
    background: "transparent",
    paddingX: { base: "2em", md: "2vw" },
    _hover: {
      background: "gray.100",
    },
  },
  aspect: {
    ratio: 1,
    width: { base: "3.5em", md: "6em" },
    height: { base: "3.5em", md: "6em" },
  },
  image: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  account: {
    flex: "1",
    direction: "row",
    justify: "space-between",
    align: "center",
    paddingLeft: { base: "1em", md: "2vw" },
    height: "100%",
  },
  username: {
    textAlign: "left",
    fontWeight: "bold",
    color: "gray.700",
  },
  icon: {
    color: "green.400",
    fontSize: "18pt",
  },
  add: {
    color: "gray.700",
    fontSize: "22pt",
  },
};
