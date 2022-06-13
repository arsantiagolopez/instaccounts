import { Flex } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import axios from "../../axios";
import { AccountsWithPosts, Post, StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";
import { Feed } from "./Feed";
import { Insights } from "./Insights";
import { Stories } from "./Stories";

interface Props {}

const Dashboard: FC<Props> = () => {
  const [accountsWithPosts, setAccountsWithPosts] = useState<AccountsWithPosts>(
    {}
  );

  const { accounts, active, mutate } = useAccounts();

  // Get user's posts
  const getUsersPosts = async (username: string, image?: string) => {
    const { data: posts, status } = await axios.get<Post[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${username}`
    );

    if (status !== 200) {
      return console.log("Could not fetch user's posts.");
    }

    const account = { [username]: { profilePic: image!, posts } };
    setAccountsWithPosts({ ...accountsWithPosts, ...account });
  };

  // Get all accounts' posts
  useEffect(() => {
    if (accounts) {
      for (const account of accounts) {
        const { username, image } = account;
        getUsersPosts(username, image);
      }
    }
  }, [accounts]);

  const storiesProps = { accounts, active, mutate };
  const feedProps = { accounts, active, accountsWithPosts };
  const insightsProps = { active };

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.left}>
        <Stories {...storiesProps} />
        <Feed {...feedProps} />
      </Flex>
      {accounts?.length ? (
        <Flex {...styles.right}>
          <Insights {...insightsProps} />
        </Flex>
      ) : null}
    </Flex>
  );
};

export { Dashboard };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: { base: "column", md: "row" },
    paddingX: { base: "0", md: "25vw" },
    minHeight: "calc(100vh - 3em)",
  },
  left: {
    flex: 6.5,
    direction: "column",
  },
  right: {
    flex: { base: "auto", md: 3.5 },
    position: { base: "static", md: "sticky" },
    top: "3em",
    maxWidth: { base: "100%", md: "35%" },
    alignSelf: { base: "auto", md: "flex-start" },
  },
};
