import {
  Avatar,
  Circle,
  Flex,
  Icon,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import React, { FC, useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { KeyedMutator } from "swr";
import axios from "../../axios";
import { Instagram, StyleProps } from "../../types";
import { AddAccountDrawer } from "../AddAccountDrawer";

interface Props {
  accounts?: Instagram[];
  active?: Instagram;
  mutate: KeyedMutator<Instagram[]>;
}

const Stories: FC<Props> = ({ accounts, active, mutate }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Update selected account's lastActive field to newest date
  const handleSelect = async (id: string): Promise<void> => {
    const { data }: AxiosResponse = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/instagrams/active/${id}`
    );
    setActiveId(data?.id);

    const updatedAccounts = accounts?.map((account) => {
      const { id, lastActive } = account;
      if (id === data?.id) {
        return { ...account, lastActive };
      }
      return account;
    });
    // @ts-ignore
    mutate(updatedAccounts);
  };

  useEffect(() => {
    if (active) setActiveId(active?.id);
  }, [active]);

  const addAccountDrawerProps = { accounts, mutate };

  return (
    <Flex {...styles.wrapper}>
      {accounts?.length ? (
        accounts?.map(({ id, image, username }, index) => (
          <Flex
            key={id ?? index}
            onClick={() => handleSelect(id)}
            {...styles.account}
          >
            {image ? (
              <Avatar
                // src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
                src={image}
                boxShadow={
                  activeId === id
                    ? "0 0 0 2px black"
                    : "0 0 0 2px rgb(230,230,230)"
                }
                {...styles.avatar}
              />
            ) : (
              <SkeletonCircle
                boxShadow={
                  activeId === id
                    ? "0 0 0 2px black"
                    : "0 0 0 2px rgb(230,230,230)"
                }
                {...styles.avatar}
                {...styles.skeleton}
              />
            )}

            <Text {...styles.username}>{username}</Text>
          </Flex>
        ))
      ) : (
        <AddAccountDrawer {...addAccountDrawerProps}>
          <Flex {...styles.account} marginLeft="1em">
            <Circle {...styles.avatar}>
              <Icon as={IoAddSharp} {...styles.add} />
            </Circle>
            <Text {...styles.username} letterSpacing="tight">
              Add account
            </Text>
          </Flex>
        </AddAccountDrawer>
      )}
    </Flex>
  );
};

export { Stories };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "row",
    align: "center",
    justify: "flex-start",
    paddingLeft: { base: "0.5em", md: "1vw" },
    paddingTop: { base: "2vh", md: "1vw" },
    paddingBottom: { base: "1vh", md: "0.75vw" },
    borderRadius: { base: "0", md: "0.25em" },
    marginTop: { base: "0", md: "4vh" },
    height: "fit-content",
    minHeight: "10vh",
    background: "white",
    overflow: "scroll",
    borderWidth: "1px",
    borderColor: "gray.200",
  },
  account: {
    direction: "column",
    maxWidth: { base: "4.5em", md: "5em" },
    minWidth: { base: "4.5em", md: "5em" },
    width: { base: "4.5em", md: "5em" },
  },
  avatar: {
    width: { base: "3em", md: "3.25em" },
    height: { base: "3em", md: "3.25em" },
    alignSelf: "center",
    cursor: "pointer",
    border: "2px solid white",
  },
  skeleton: {
    width: { base: "3.25em", md: "3.5em" },
    height: { base: "3.25em", md: "3.5em" },
  },
  username: {
    textAlign: "center",
    fontSize: "9pt",
    isTruncated: true,
    paddingTop: "1",
    fontWeight: "normal",
  },
  add: {
    color: "gray.700",
    fontSize: "12pt",
  },
};
