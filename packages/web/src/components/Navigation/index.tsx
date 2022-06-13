import { Box, Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { BiAt } from "react-icons/bi";
import { BsHouseDoor, BsHouseDoorFill } from "react-icons/bs";
import { IoAt, IoTrendingUpSharp } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";
import { StyleProps } from "../../types";
import { Logo } from "../Logo";
import { ProfileAvatar } from "../ProfileAvatar";

interface Props {
  user?: object;
}

const Navigation: FC<Props> = ({ user }) => {
  const { pathname } = useRouter();

  const profileAvatarProps = { user };

  return (
    <Flex {...styles.wrapper}>
      <Box {...styles.logoWrapper}>
        <Logo />
      </Box>

      <Flex {...styles.icons}>
        <Link href="/">
          <IconButton
            aria-label="Home"
            icon={pathname === "/" ? <BsHouseDoorFill /> : <BsHouseDoor />}
            {...styles.icon}
          />
        </Link>
        <Link href="/accounts">
          <IconButton
            aria-label="Accounts"
            icon={pathname.includes("/accounts") ? <BiAt /> : <IoAt />}
            {...styles.icon}
          />
        </Link>
        {/* <Link href="/apps">
          <IconButton
            aria-label="Find Apps"
            icon={pathname.includes("/apps") ? <DiAppstore /> : <DiAppstore />}
            {...styles.icon}
          />
        </Link> */}
        <Link href="/bot">
          <IconButton
            aria-label="InstaPy Bot"
            icon={
              pathname.includes("/bot") ? (
                <MdTrendingUp />
              ) : (
                <IoTrendingUpSharp />
              )
            }
            {...styles.icon}
          />
        </Link>

        <ProfileAvatar {...profileAvatarProps} />
      </Flex>
    </Flex>
  );
};

export { Navigation };

// Styles

const styles: StyleProps = {
  wrapper: {
    zIndex: 998,
    position: "sticky",
    top: "0",
    direction: "row",
    align: "center",
    justify: "space-between",
    width: "100%",
    height: "3em",
    borderBottom: "1px solid",
    borderBottomColor: "gray.200",
    paddingX: { base: "1em", md: "25vw" },
    background: "white",
  },
  logoWrapper: {
    position: "relative",
    width: "7.5em",
    height: "50%",
  },
  icons: {
    direction: "row",
  },
  icon: {
    fontSize: "18pt",
    color: "gray.700",
    background: "transparent",
    marginLeft: { base: "0.25em", md: "0.5em" },
    _hover: {
      color: "black",
    },
    _active: {},
  },
};
