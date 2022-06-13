import { Flex, Spinner } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { StyleProps } from "../../types";
import { useDimensions } from "../../utils/useDimensions";

interface Props {
  isFullScreen: boolean;
}

const LoadingScreen: FC<Props> = ({ isFullScreen }) => {
  const [screenHeight, setScreenHeight] = useState<number | null>(null);
  const { height } = useDimensions();
  useEffect(() => setScreenHeight(height), [height]);
  return (
    <Flex
      {...styles.wrapper}
      justify={isFullScreen ? "center" : "flex-start"}
      height={isFullScreen ? screenHeight : "100%"}
    >
      <Spinner marginTop={isFullScreen ? "none" : "30vh"} {...styles.spinner} />
    </Flex>
  );
};

export { LoadingScreen };

// Styles

const styles: StyleProps = {
  wrapper: {
    zIndex: "5000",
    position: "absolute",
    top: "0",
    left: "0",
    direction: "column",
    align: "center",
    marginX: "auto",
    width: "100%",
    background: "rgba(255,255,255,0.5)",
    backdropFilter: "blur(3px)",
  },
  spinner: {
    color: "gray.800",
    size: "xl",
    thickness: "5px",
  },
};
