import { Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../types";

interface Props {}

const AppStore: FC<Props> = () => {
  return <Flex {...styles.wrapper}>Check out these apps!</Flex>;
};

export { AppStore };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    paddingX: { base: "0", md: "25vw" },
    minHeight: "calc(100vh - 3em)",
  },
};
