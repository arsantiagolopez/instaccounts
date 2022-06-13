import { Flex, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../types";

interface Props {}

const Settings: FC<Props> = () => {
  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.content}>
        <Text {...styles.heading}>Some Settings Here</Text>
      </Flex>
    </Flex>
  );
};

export { Settings };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    marginX: { base: "0", md: "25vw" },
    minHeight: "calc(100vh - 3em)",
    marginTop: { base: "0", md: "4vh" },
    marginBottom: "0.75em",
    background: "white",
    border: { base: "none", md: "1px solid" },
    borderColor: { base: "none", md: "gray.200" },
    borderRadius: "0.25em",
  },
  content: {
    direction: "column",
    padding: "0.75em",
  },
  heading: {
    fontWeight: "semibold",
    letterSpacing: "-0.25px",
  },
};
