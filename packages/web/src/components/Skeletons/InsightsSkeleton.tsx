import { Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../types";
import { Footer } from "../Footer";

interface Props {}

const InsightsSkeleton: FC<Props> = () => (
  <Flex {...styles.wrapper}>
    <Flex {...styles.profile}>
      <SkeletonCircle {...styles.avatar} />

      <Flex {...styles.meta} marginRight="auto">
        <Skeleton {...styles.skeletonUsername} />
        <Skeleton {...styles.skeletonName} />
      </Flex>
    </Flex>

    <Flex {...styles.apps}>
      <Flex {...styles.heading}>
        <Text {...styles.header}>Apps</Text>

        <Text {...styles.find} color="black">
          Find Apps
        </Text>
      </Flex>

      <Flex {...styles.items}>
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <Flex key={index} {...styles.app}>
              <SkeletonCircle {...styles.appAvatar} />
              <Flex {...styles.appMeta}>
                <Skeleton {...styles.skeletonUsername} />
                <Skeleton {...styles.skeletonDescription} />
              </Flex>
            </Flex>
          ))}
      </Flex>

      <Footer />
    </Flex>
  </Flex>
);

export { InsightsSkeleton };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    paddingY: "4vh",
    height: "fit-content",
    width: "100%",
    paddingLeft: { base: "1em", md: "1.5vw" },
    paddingRight: { base: "1em", md: "0" },
  },
  profile: {
    direction: "row",
    justify: "space-between",
    align: "center",
    paddingY: "2vh",
    letterSpacing: "tight",
  },
  avatar: {
    height: "3em",
    width: "3em",
  },
  meta: {
    flex: "auto",
    direction: "column",
    paddingLeft: "1vw",
    justify: "center",
    maxWidth: "70%",
  },
  apps: {
    direction: "column",
  },
  heading: {
    direction: "row",
    justify: "space-between",
    align: "flex-end",
  },
  header: {
    fontWeight: "bold",
    fontSize: "11pt",
    color: "gray.500",
  },
  find: {
    color: "black",
    fontSize: "9pt",
    fontWeight: "semibold",
    letterSpacing: "tight",
    cursor: "pointer",
  },
  items: {
    direction: "column",
    paddingY: { base: "1em", md: "1vh" },
  },
  app: {
    direction: "row",
    align: "center",
    paddingY: { base: "2", md: "0.75em" },
  },
  appAvatar: {
    height: "1.8em",
    width: "1.8em",
  },
  appMeta: {
    direction: "column",
    width: "100%",
    paddingLeft: "0.75em",
  },
  skeletonUsername: {
    height: "12pt",
    width: { base: "40vw", md: "7vw" },
    marginBottom: "1",
  },
  skeletonName: {
    height: "12pt",
    width: { base: "40vw", md: "10vw" },
  },
  skeletonDescription: {
    height: "12pt",
    width: { base: "40vw", md: "10vw" },
  },
};
