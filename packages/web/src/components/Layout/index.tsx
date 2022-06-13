import { Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../types";
import { Navigation } from "../Navigation";

interface Props {
  children: JSX.Element;
  user?: object;
}

const Layout: FC<Props> = ({ children, user }) => {
  const navigationProps = { user };
  return (
    <Flex {...styles.wrapper}>
      <Navigation {...navigationProps} />
      <Flex {...styles.content}>{children}</Flex>
    </Flex>
  );
};

export { Layout };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
  },
  content: {
    position: "relative",
    direction: "column",
    background: "rgba(250,250,250,0.5)",
  },
};
