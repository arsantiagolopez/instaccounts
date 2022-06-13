import { Flex, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../types";

interface Props {}

const ProfileSkeleton: FC<Props> = () => (
  <Flex {...styles.wrapper}>
    <Flex {...styles.profile}>
      <SkeletonCircle {...styles.avatar} />
      <Flex {...styles.info}>
        <Skeleton {...styles.skeletonUsername} />
        <Skeleton {...styles.skeletonInsights} />
        <Flex {...styles.meta} {...styles.desktopOnly}>
          <Skeleton {...styles.skeletonNameDesktop} />
          <SkeletonText {...styles.skeletonTextDesktop} />
        </Flex>
      </Flex>
    </Flex>
    <Flex {...styles.meta}>
      <Skeleton {...styles.skeletonNameMobile} />
      <SkeletonText {...styles.skeletonTextMobile} />
    </Flex>
  </Flex>
);

export { ProfileSkeleton };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    paddingTop: "2vh",
  },
  profile: {
    direction: "row",
  },
  avatar: {
    height: { base: "4.5em", md: "10em" },
    width: { base: "4.5em", md: "10em" },
    marginX: { base: "1em", md: "5vw" },
    marginY: { base: "1em", md: "5vh" },
  },
  info: {
    direction: "column",
    justify: "flex-start",
    align: "flex-start",
    minHeight: { base: "auto", md: "30vh" },
    paddingY: { base: "1em", md: "5vh" },
    overflow: "hidden",
  },
  meta: {
    display: { base: "flex", md: "none" },
    direction: "column",
    paddingBottom: { base: "3vh", md: "1vh" },
    paddingX: { base: "1em", md: "0" },
    minHeight: "10vh",
  },
  desktopOnly: {
    display: { base: "none", md: "flex" },
  },
  skeletonUsername: {
    height: "3vh",
    width: { base: "40vw", md: "10vw" },
  },
  skeletonInsights: {
    height: { base: "2vh", md: "3vh" },
    width: { base: "60vw", md: "20vw" },
    marginTop: "2vh",
  },
  skeletonNameDesktop: {
    height: "2vh",
    width: "7vw",
    marginTop: "2vh",
  },
  skeletonTextDesktop: {
    noOfLines: 3,
    spacing: "3",
    width: "15vw",
    marginTop: "2vh",
  },
  skeletonNameMobile: {
    height: "2vh",
    width: "40vw",
  },
  skeletonTextMobile: {
    noOfLines: 3,
    width: "50vw",
    marginTop: "2vh",
  },
};
