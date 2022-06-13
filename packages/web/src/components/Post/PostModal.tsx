import {
  Avatar,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { FC } from "react";
import { TiHeartFullOutline } from "react-icons/ti";
import { VscChevronLeft } from "react-icons/vsc";
import { Post, StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";
import { PostImage } from "../PostImage";

interface Props {
  post: Partial<Post>;
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: FC<Props> = ({ post, isOpen, onClose }) => {
  const {
    height,
    width,
    username,
    location,
    likes,
    comments,
    timestamp,
    caption,
  } = post || {};

  const { active } = useAccounts();

  const dimensions = width! / height!;

  const formatedDate = moment(timestamp).format("MMMM D");
  const weeksFromNow = moment().diff(timestamp, "weeks");
  const daysSincePost = moment().diff(timestamp, "days");
  const fromNow =
    daysSincePost > 7 ? `${weeksFromNow}w` : moment(timestamp).fromNow();

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...styles.wrapper}>
      <ModalOverlay {...styles.overlay} />

      <ModalContent {...styles.content}>
        <ModalBody {...styles.body}>
          <Flex {...styles.topBar}>
            <ModalCloseButton as={VscChevronLeft} {...styles.backButton} />
            <Heading size="sm">Photo</Heading>
          </Flex>

          <Flex {...styles.profileBar} {...styles.mobileOnly}>
            <Avatar
              // src={`${process.env.NEXT_PUBLIC_API_URL}/${active?.image}`}
              src={active?.image}
              {...styles.avatar}
            />
            <Flex {...styles.info}>
              <Text {...styles.username}>{username}</Text>
              <Text {...styles.location}>{location}</Text>
            </Flex>
          </Flex>

          <Flex {...styles.image}>
            <PostImage post={post} ratio={{ base: dimensions, md: 1 }} />
          </Flex>

          <Flex {...styles.meta}>
            <Flex {...styles.profileBar} {...styles.desktopOnly}>
              <Avatar
                // src={`${process.env.NEXT_PUBLIC_API_URL}/${active?.image}`}
                src={active?.image}
                {...styles.avatar}
              />
              <Flex {...styles.info}>
                <Text {...styles.username}>{username}</Text>
                <Text {...styles.location}>{location}</Text>
              </Flex>
            </Flex>

            <Flex {...styles.comments}>
              <Flex {...styles.caption}>
                <Avatar
                  // src={`${process.env.NEXT_PUBLIC_API_URL}/${active?.image}`}
                  src={active?.image}
                  {...styles.captionAvatar}
                  {...styles.desktopOnly}
                />
                <Flex {...styles.comment}>
                  <Text {...styles.text}>
                    <b>{username}</b> {caption}
                  </Text>
                  <Text {...styles.fromNow}>{fromNow}</Text>
                </Flex>
              </Flex>
              <Text {...styles.allComments}>{comments} comments</Text>
            </Flex>

            <Flex {...styles.likes}>
              <Text {...styles.text}>
                <Icon as={TiHeartFullOutline} {...styles.icon} />
                Liked by <b>{likes} people</b>
              </Text>
            </Flex>

            <Text {...styles.timestamp}>{formatedDate}</Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { PostModal };

// Styles

const styles: StyleProps = {
  wrapper: {
    size: "full",
  },
  overlay: {
    background: "rgba(0,0,0,0.8)",
  },
  content: {
    borderRadius: "0",
    height: { base: "100vh", md: "80vh" },
    marginX: { base: "0", md: "10vw" },
    overflow: "hidden",
  },
  body: {
    display: "flex",
    flexDirection: { base: "column", md: "row" },
    width: { base: "100%", md: "100%" },
    padding: "0",
  },
  meta: {
    flex: 4,
    direction: "column",
    height: "100%",
    paddingY: "0",
  },
  topBar: {
    display: { base: "flex", md: "none" },
    height: "3em",
    align: "center",
    justify: "center",
    borderBottom: "1px solid",
    borderColor: "gray.200",
  },
  backButton: {
    position: "absolute",
    left: "1.5em",
    height: "3.25em",
    color: "black",
    zIndex: "9999",
    size: "sm",
  },
  mobileOnly: {
    display: { base: "flex", md: "none" },
  },
  desktopOnly: {
    display: { base: "none", md: "flex" },
  },
  profileBar: {
    direction: "row",
    height: { base: "4.25em", md: "7em" },
    width: "100%",
    align: "center",
    borderBottom: "1px solid",
    borderColor: "gray.100",
    paddingX: { base: "1em", md: "1.5em" },
  },
  avatar: {
    height: { base: "1.75em", md: "1.5em" },
    width: { base: "1.75em", md: "1.5em" },
  },
  text: {
    fontSize: "11pt",
  },
  info: {
    direction: "column",
    marginLeft: "1em",
  },
  username: {
    fontSize: "11pt",
    fontWeight: "semibold",
    letterSpacing: "tight",
    lineHeight: "1.25em",
  },
  location: {
    fontSize: "9pt",
  },
  image: {
    flex: 6,
  },
  comments: {
    order: { base: 2, md: 1 },
    direction: "column",
    height: "100%",
    paddingX: { base: "1em", md: "1.5em" },
    borderBottom: { base: "0", md: "1px solid" },
    borderColor: { base: "none", md: "gray.100" },
  },
  caption: {
    direction: "row",
    marginTop: "1.5em",
    marginBottom: "0.25em",
    align: "flex-start",
  },
  captionAvatar: {
    height: { base: "1.25em", md: "1.5em" },
    width: { base: "1.25em", md: "1.5em" },
  },
  comment: {
    direction: "column",
    paddingX: { base: "0", md: "1em" },
  },
  fromNow: {
    fontSize: "9pt",
    color: "gray.500",
    paddingY: "1em",
  },
  allComments: {
    fontSize: { base: "10pt", md: "9pt" },
    paddingLeft: { base: "0", md: "3.75em" },
    color: "gray.500",
  },
  likes: {
    order: { base: 1, md: 2 },
    direction: "column",
    marginTop: "1em",
    paddingX: { base: "1em", md: "1.25em" },
  },
  icon: {
    marginRight: "2",
    fontSize: "16pt",
    marginBottom: "-1",
  },
  timestamp: {
    order: 3,
    textTransform: "uppercase",
    fontSize: "8pt",
    color: "gray.500",
    paddingY: "1em",
    marginBottom: { base: "1em", md: "7em" },
    paddingX: { base: "1.5em", md: "2em" },
  },
};
