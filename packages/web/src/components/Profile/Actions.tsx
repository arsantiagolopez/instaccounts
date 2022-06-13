import { Avatar, Flex, Text } from "@chakra-ui/react";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Action, StyleProps } from "../../types";

interface Props {
  actions: Action[];
  setActions: Dispatch<SetStateAction<Action[]>>;
}

const Actions: FC<Props> = ({ actions, setActions }) => {
  const PREVIEW_IMAGE =
    "https://images.unsplash.com/photo-1616628188502-413f2fe46e5e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80";

  const { name: activeAction } = actions.find(({ active }) => active) || {};

  const isPreviewActive = activeAction === "PREVIEW";

  // Set action to active, default if same action clicked
  const handleSetAction = (action: string) => {
    if (action === activeAction) {
      const defaultActive = actions.map((obj) =>
        obj?.name === "DEFAULT"
          ? { ...obj, active: true }
          : { ...obj, active: false }
      );
      return setActions(defaultActive);
    }
    const updatedActive = actions.map((obj) =>
      obj?.name === action
        ? { ...obj, active: true }
        : { ...obj, active: false }
    );
    return setActions(updatedActive);
  };

  return (
    <Flex {...styles.wrapper}>
      <Flex onClick={() => handleSetAction("PREVIEW")} {...styles.action}>
        <Avatar
          src={PREVIEW_IMAGE}
          boxShadow={
            isPreviewActive
              ? "0 0 0 1px black"
              : "0 0 0 1px rgba(220,220,220,1)"
          }
          {...styles.avatar}
        />
        <Text {...styles.text}>Preview posts</Text>
      </Flex>
      <Flex {...styles.action}>
        <Avatar {...styles.avatar} />
        <Text {...styles.text}>Something else</Text>
      </Flex>
    </Flex>
  );
};

export { Actions };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "row",
    minHeight: { base: "12vh", md: "15vh" },
    paddingX: { base: "1em", md: "3vw" },
  },
  action: {
    position: "relative",
    direction: "column",
    align: "center",
    maxWidth: { base: "25vw", md: "8vw" },
    width: "100%",
    cursor: "pointer",
    userSelect: "none",
  },
  avatar: {
    width: { base: "3em", md: "4em" },
    height: { base: "3em", md: "4em" },
    border: "3px solid white",
    _hover: {
      boxShadow: "0 0 0 1px black",
    },
  },
  overlay: {
    position: "absolute",
    bg: "black",
    opacity: 0.5,
    color: "white",
  },
  text: {
    fontWeight: "semibold",
    fontSize: { base: "10pt", md: "12pt" },
    paddingTop: "2vh",
    textAlign: "center",
  },
};
