import { Avatar, Button, Flex, Icon, SkeletonCircle } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useRef, useState } from "react";
import { IoPersonCircleOutline, IoSettingsSharp } from "react-icons/io5";
import { StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";

interface Props {
  user?: object;
}

const ProfileAvatar: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { active } = useAccounts();
  const { image } = active || {};

  const { pathname } = useRouter();
  const isProfile = pathname === "/profile";

  const panelRef: any = useRef(null);

  const handleBlur = (event: React.MouseEvent): void => {
    const { relatedTarget: clickedNode } = event;

    // If clicked outside panel
    if (!panelRef?.current?.contains(clickedNode)) {
      setIsOpen(false);
    }
  };

  return (
    <Flex {...styles.popover}>
      <Flex
        {...styles.popoverTrigger}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={handleBlur}
        tabIndex={1}
      >
        {image && typeof image !== "undefined" && typeof image !== null ? (
          <Avatar
            // src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
            src={image}
            boxShadow={(isProfile || isOpen) && "0 0 0 1px black"}
            border={(isProfile || isOpen) && "2px solid white"}
            {...styles.avatar}
          />
        ) : (
          <SkeletonCircle {...styles.avatar} />
        )}
      </Flex>

      <Flex
        ref={panelRef}
        {...styles.content}
        display={isOpen ? "block" : "none"}
        onClick={() => setIsOpen(false)}
      >
        <Flex {...styles.navButtons}>
          <Link href="/profile">
            <a>
              <Flex {...styles.link}>
                <Icon as={IoPersonCircleOutline} {...styles.icon} />
                Profile
              </Flex>
            </a>
          </Link>
          <Link href="/settings">
            <a>
              <Flex {...styles.link}>
                <Icon as={IoSettingsSharp} {...styles.icon} />
                Settings
              </Flex>
            </a>
          </Link>
        </Flex>

        <Button onClick={() => signOut()} {...styles.logout}>
          Log out
        </Button>
      </Flex>
    </Flex>
  );
};

export { ProfileAvatar };

// Styles

const styles: StyleProps = {
  popover: {
    zIndex: 999,
    position: "relative",
    align: "center",
    justify: "center",
    marginLeft: "1em",
  },
  popoverTrigger: {
    cursor: "pointer",
    margin: "0",
  },
  content: {
    position: "absolute",
    right: { base: "-2", md: "-5" },
    top: "2.5em",
    width: "13em",
    bg: "white",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "0.25em",
  },
  avatar: {
    cursor: "pointer",
    width: "17pt",
    height: "17pt",
  },
  link: {
    fontSize: "10pt",
    width: "100%",
    align: "center",
    paddingY: "2",
    paddingX: "2",
    _hover: {
      background: "rgba(240,240,240,0.5)",
    },
  },
  icon: {
    marginRight: "2",
    fontSize: "12pt",
    color: "gray.600",
  },
  navButtons: {
    direction: "column",
  },
  logout: {
    fontSize: "10pt",
    width: "100%",
    variant: "unstyled",
    fontWeight: "normal",
    cursor: "pointer",
    borderTop: "1px solid rgba(200,200,200,0.3)",
    borderRadius: "0",
    textAlign: "left",
    paddingInline: "3",
    background: "none",
    color: "gray.700",
    height: "3em",
    _hover: {
      background: "rgba(240,240,240,0.5)",
    },
  },
};
