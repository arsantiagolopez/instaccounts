import { Flex } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { AccountsWithPosts, Instagram, StyleProps } from "../../types";
import { Apps } from "../Apps";
import { NoAccountsScreen } from "../Screens";

interface Props {
  accounts?: Instagram[];
  active?: Instagram;
  accountsWithPosts: AccountsWithPosts;
}

const Feed: FC<Props> = ({ accounts, active, accountsWithPosts }) => {
  const [updatedAccounts, setUpdatedAccounts] =
    useState<AccountsWithPosts>(accountsWithPosts);

  // Update image names with API url
  useEffect(() => {
    if (accountsWithPosts) {
      const accounts: AccountsWithPosts = {};

      // Iterate through accounts
      Object.keys(accountsWithPosts).map((account) => {
        let { profilePic, posts } = accountsWithPosts[account] || {};

        // Update profile picture
        // profilePic = `${process.env.NEXT_PUBLIC_API_URL}/${accountsWithPosts[account].profilePic}`;
        // profilePic = accountsWithPosts[account].profilePic;

        // // Update images & potential carousels
        // posts = posts.map((post) => {
        //   let { image, isCarousel, carouselImages } = post;

        //   if (isCarousel) {
        //     carouselImages = carouselImages?.map(
        //       (image) => process.env.NEXT_PUBLIC_API_URL + image
        //     );
        //   }

        //   return { ...post, image, carouselImages };
        // });

        // Return updated account
        accounts[account] = { profilePic, posts };
      });

      setUpdatedAccounts(accounts);
    }
  }, [accountsWithPosts]);

  const appsProps = { accountsWithPosts: updatedAccounts };

  return (
    <Flex {...styles.wrapper}>
      {!accounts?.length ? <NoAccountsScreen /> : <Apps {...appsProps} />}
    </Flex>
  );
};

export { Feed };

// Styles

const styles: StyleProps = {
  wrapper: {
    justify: "center",
    width: "100%",
    minHeight: {
      base: "calc(100vh - 3em - 50vh)",
      md: "calc(100vh - 3em - 50vh)",
    },
  },
};
