import { Avatar, Flex, SkeletonCircle, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Instagram, StyleProps } from "../../types";
import { Footer } from "../Footer";
import { ManageAppDrawer } from "../ManageAppDrawer";
import { InsightsSkeleton } from "../Skeletons";

interface Props {
  active?: Instagram;
}

const Insights: FC<Props> = ({ active }) => {
  const { image, username, name, isAuthorized } = active || {};

  const { apps } = useContext(AppContext);

  if (!apps || !username) {
    return <InsightsSkeleton />;
  }

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.profile}>
        {image ? (
          <Avatar
            // src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
            src={image}
            {...styles.avatar}
          />
        ) : (
          <SkeletonCircle {...styles.avatar} />
        )}

        <Flex {...styles.meta}>
          <Text {...styles.username}>{username}</Text>
          <Text {...styles.name}>{name}</Text>
        </Flex>
        {isAuthorized ? (
          <Link href="/accounts">
            <Text {...styles.action}>Switch</Text>
          </Link>
        ) : (
          <Text {...styles.action} cursor="auto">
            Authorizing
          </Text>
        )}
      </Flex>

      <Flex {...styles.apps}>
        <Flex {...styles.heading}>
          <Text {...styles.header}>Apps</Text>
          <Link href="/apps">
            <Text {...styles.find} color="black">
              Find Apps
            </Text>
          </Link>
        </Flex>

        <Flex {...styles.items}>
          {apps.map((app, index) => {
            const { name, description, image } = app;
            return (
              <Flex key={name ?? index} {...styles.app}>
                <Avatar src={image} {...styles.appAvatar} />
                <Flex {...styles.appMeta}>
                  <Text {...styles.username}>{name}</Text>
                  <Text {...styles.description}>{description}</Text>
                </Flex>
                <ManageAppDrawer app={app} />
              </Flex>
            );
          })}
        </Flex>

        <Footer />
      </Flex>
    </Flex>
  );
};

export { Insights };

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
  username: {
    fontWeight: "bold",
    fontSize: "11pt",
    isTruncated: true,
  },
  name: {
    fontWeight: "semibold",
    fontSize: "10pt",
    color: "gray.500",
    isTruncated: true,
  },
  action: {
    fontSize: "9pt",
    color: "blue.400",
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: "tight",
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
  description: {
    fontSize: "9pt",
    lineHeight: "1em",
    color: "gray.500",
    noOfLines: 1,
  },
};
