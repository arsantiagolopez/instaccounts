import { Flex, Heading, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";
import { AddAccountDrawer } from "../AddAccountDrawer";

interface Props {}

const NoAccountsScreen: FC<Props> = () => {
  const { accounts, mutate } = useAccounts();
  const addAccountDrawerProps = { accounts, mutate };
  return (
    <Flex {...styles.wrapper}>
      <Heading {...styles.emoji}>😕</Heading>
      <Text {...styles.text}>
        No account&apos;s been added. Add one to start managing it.
      </Text>
      <AddAccountDrawer {...addAccountDrawerProps}>
        <Text {...styles.add}>Add account</Text>
      </AddAccountDrawer>
    </Flex>
  );
};

export { NoAccountsScreen };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    justify: "center",
    align: "center",
    width: "auto",
    marginX: { base: "2em", md: "auto" },
  },
  emoji: {
    fontSize: "32pt",
    paddingY: "2vh",
  },
  text: {
    fontSize: "10pt",
    color: "gray.600",
    textAlign: "center",
  },
  add: {
    display: "inline-block",
    fontWeight: "semibold",
    textDecoration: "underline",
    cursor: "pointer",
    paddingY: "1vh",
    color: "gray.600",
  },
};
