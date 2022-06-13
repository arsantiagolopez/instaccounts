import { Flex } from "@chakra-ui/react";
import { getPosts } from "instaccounts-instafeed";
import React, { FC, useContext, useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { AppContext } from "../../context/AppContext";
import { AccountsWithPosts, StyleProps } from "../../types";

interface Props {
  accountsWithPosts: AccountsWithPosts;
}

const Apps: FC<Props> = ({ accountsWithPosts }) => {
  const [posts, setPosts] = useState<JSX.Element[]>([]);
  const { apps } = useContext(AppContext);

  // Only show active apps' posts
  useEffect(() => {
    if (accountsWithPosts) {
      let newPosts: JSX.Element[] = [];

      apps?.map((app) => {
        let { name, isActive } = app;
        name = name.toLowerCase();

        switch (name) {
          case "instagram feed":
            if (isActive) {
              const instafeedPosts = getPosts(accountsWithPosts);
              newPosts = [...posts, ...instafeedPosts];
            }
            break;
          default:
            break;
        }
      });

      newPosts.sort(
        (a, b) =>
          +new Date(b.props.children.props.post.timestamp) -
          +new Date(a.props.children.props.post.timestamp)
      );

      setPosts(newPosts);
    }
  }, [apps, accountsWithPosts]);

  return (
    <Flex {...styles.wrapper}>
      <Virtuoso
        useWindowScroll
        data={posts}
        style={{ width: "100%" }}
        itemContent={(_, post) => post}
      />
    </Flex>
  );
};

export { Apps };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    paddingY: "0.75em",
    width: "100%",
  },
};
