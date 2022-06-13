import {
  AspectRatio,
  Avatar,
  Button,
  Circle,
  Flex,
  Icon,
  SkeletonCircle,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { KeyedMutator } from "swr";
import axios from "../../axios";
import { Instagram, StyleProps } from "../../types";
import { DeleteAccount } from "../DeleteAccount";

interface Props {
  account: Instagram;
  activeId: string | null;
  setActiveId: Dispatch<SetStateAction<string | null>>;
  accounts?: Instagram[];
  mutate: KeyedMutator<Instagram[]>;
}

type HTMLElementEvent<T extends HTMLElement> = Event & {
  relatedTarget: T;
};

const Card: FC<Props> = ({
  account,
  activeId,
  setActiveId,
  accounts,
  mutate,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  const {
    id,
    image,
    username,
    isAuthorized,
    // insights @TODO set up insights
  } = account;

  const wrapperRef: React.MutableRefObject<undefined> = useRef();

  let insights: string | null = null;
  // @todo: decide on activity, e.g. "15 new likes, 5 new followers"
  let activity = insights ?? image ? "Account live" : "Loading profile...";

  // Update selected account's lastActive field to newest date
  const handleSelect = async (id: string): Promise<void> => {
    const { data }: AxiosResponse = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/instagrams/active/${id}`
    );
    setActiveId(data?.id);
  };

  // Set item to hovered
  const handleHover = () => setIsHovered(true);

  // Prevent ref's children from clearing hovered state
  const handleBlur = (event: HTMLElementEvent<HTMLButtonElement>): void => {
    const { relatedTarget: hoveredNode } = event;
    //@ts-ignore
    const hoveredNodeInsideRef = wrapperRef?.current?.contains(hoveredNode);
    if (!hoveredNodeInsideRef) {
      if (!isDeleteAlertOpen) setIsHovered(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) {
      setStatus("Authenticating...");
    }
  }, [account]);

  // Hide delete on alert cancel
  useEffect(() => {
    if (!isDeleteAlertOpen) setIsHovered(false);
  }, [isDeleteAlertOpen]);

  const deleteAccountProps = {
    username,
    accounts,
    mutate,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
  };

  return (
    <Button
      ref={wrapperRef}
      onClick={() => handleSelect(id)}
      onMouseEnter={handleHover}
      onMouseOut={handleBlur}
      as="div"
      {...styles.button}
    >
      <AspectRatio {...styles.aspect}>
        {image ? (
          <Avatar
            // src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
            src={image}
            {...styles.image}
          />
        ) : (
          <SkeletonCircle {...styles.image} />
        )}
      </AspectRatio>
      <Flex {...styles.account}>
        <Flex {...styles.info}>
          <Text {...styles.username}>{username}</Text>
          <Flex {...styles.meta}>
            <Circle
              background={isAuthorized ? "green.400" : "red.400"}
              {...styles.circle}
            />
            {isAuthorized ? activity : status}
          </Flex>
        </Flex>
        <Flex>
          {activeId === id && isHovered && (
            <DeleteAccount
              trigger={
                <Icon as={MdCancel} {...styles.icon} {...styles.delete} />
              }
              {...deleteAccountProps}
            />
          )}
          {activeId === id &&
            (isAuthorized ? (
              <Icon as={IoCheckmarkCircleSharp} {...styles.icon} />
            ) : (
              <Spinner {...styles.spinner} />
            ))}
        </Flex>
      </Flex>
    </Button>
  );
};

export { Card };

// Styles

const styles: StyleProps = {
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    align: "center",
    height: { base: "10vh", md: "13vh" },
    background: "transparent",
    paddingX: { base: "2em", md: "2vw" },
    _hover: {
      background: "gray.100",
    },
  },
  aspect: {
    ratio: 1,
    width: { base: "3.5em", md: "6em" },
    height: { base: "3.5em", md: "6em" },
  },
  image: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  account: {
    flex: "1",
    direction: "row",
    justify: "space-between",
    align: "center",
    paddingLeft: { base: "1em", md: "2vw" },
    height: "100%",
  },
  info: {
    direction: "column",
    align: "flex-start",
    color: "gray.800",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    fontWeight: "normal",
    paddingTop: { base: "1", md: "1vh" },
    color: "gray.500",
  },
  circle: {
    size: "0.5em",
    marginRight: "0.5em",
  },
  icon: {
    color: "green.400",
    fontSize: "18pt",
  },
  delete: {
    color: "red.400",
    marginRight: "1",
  },
  spinner: {
    color: "gray.800",
    speed: "1s",
    size: "md",
    thickness: "3px",
  },
};
