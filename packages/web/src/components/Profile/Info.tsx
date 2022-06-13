import { Avatar, Flex, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import useSWR from "swr";
import { Instagram, Post, StyleProps } from "../../types";
import { ProfileSkeleton } from "../Skeletons";

interface Props {
  account?: Instagram;
}

const Info: FC<Props> = ({ account }) => {
  const { image, username, name, bio, followers, following } = account || {};

  const { data: posts } = useSWR<Post[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${username}`
  );

  // Show loading skeleton
  if (!account) {
    return <ProfileSkeleton />;
  }

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.profile}>
        {image || typeof image === "undefined" ? (
          <Avatar
            // src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
            src={image}
            {...styles.avatar}
          />
        ) : (
          <SkeletonCircle {...styles.avatar} />
        )}
        <Flex {...styles.info}>
          <Text {...styles.username}>{username}</Text>
          <Flex {...styles.insights}>
            <Text {...styles.text} marginRight="1.5vw">
              <b>{posts?.length}</b> posts
            </Text>
            <Text {...styles.text} marginRight="1.5vw">
              <b>{followers}</b> followers
            </Text>
            <Text {...styles.text} marginRight="1.5vw">
              <b>{following}</b> following
            </Text>
          </Flex>
          <Flex {...styles.meta} {...styles.desktopOnly}>
            <Text {...styles.name}>{name}</Text>
            <Text {...styles.text}>{bio}</Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex {...styles.meta}>
        <Text {...styles.name}>{name}</Text>
        <Text {...styles.text}>{bio}</Text>
      </Flex>
    </Flex>
  );
};

export { Info };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
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
    paddingY: { base: "1em", md: "4vh" },
    overflow: "hidden",
  },
  username: {
    fontWeight: "normal",
    fontSize: { base: "22pt", md: "26pt" },
    letterSpacing: "tight",
    overflow: "hidden",
    whiteSpace: "nowrap",
    display: "block",
    textOverflow: "ellipsis",
    width: { base: "90%", md: "100%" },
  },
  insights: {
    direction: "row",
    paddingY: { base: "0", md: "2vh" },
  },
  meta: {
    display: { base: "flex", md: "none" },
    direction: "column",
    paddingBottom: { base: "3vh", md: "1vh" },
    paddingX: { base: "1em", md: "0" },
    minHeight: "10vh",
  },
  name: {
    fontWeight: "semibold",
    fontSize: { base: "12pt", md: "14pt" },
    paddingBottom: "0.5vh",
  },
  text: {
    fontSize: { base: "10pt", md: "12pt" },
    whiteSpace: "pre-line", // Allow \n to show new lines
  },
  desktopOnly: {
    display: { base: "none", md: "flex" },
  },
};
