import { Flex } from "@chakra-ui/react";
import React, { FC, forwardRef, useEffect, useRef, useState } from "react";
import { VirtuosoGrid, VirtuosoGridHandle } from "react-virtuoso";
import useSWR from "swr";
import { Instagram, Post as PostEntity, StyleProps } from "../../types";
import { Post } from "../Post";

interface PostWithIsPreview extends Partial<PostEntity> {
  isPreview?: boolean;
}

interface Props {
  account?: Instagram;
  previews: PostWithIsPreview[];
}

const Feed: FC<Props> = ({ account, previews }) => {
  const [posts, setPosts] = useState<PostWithIsPreview[]>([]);

  const { username } = account || {};

  const { data } = useSWR(
    username && `${process.env.NEXT_PUBLIC_API_URL}/posts/${username}`
  );

  // Merge previews & real posts
  useEffect(() => {
    previews.forEach((preview) => {
      const previewExists = posts.find(({ id }) => id === preview.id);
      if (!previewExists) {
        setPosts([preview, ...posts]);
      }
    });
  }, [previews]);

  // Reset posts on action reset
  useEffect(() => {
    if (!previews.length) {
      const nonPreviewPosts = posts.filter(({ isPreview }) => !isPreview);
      setPosts(nonPreviewPosts);
    }
  }, [previews]);

  // Update posts with fetch
  useEffect(() => {
    if (data) setPosts(data);
  }, [data]);

  const ref = useRef<VirtuosoGridHandle>(null);

  // 50vw list width, 3 posts per line, every post is 32.5%,
  // Bottom margins: { base: 1.5%, md: 1% }
  // For mobile, 50 * (0.325 + 0.0015) = 50 * 0.34 + 5vh (list end padding)
  // For desktop, 50 * (0.32.5 + 0.001) = 50 * 0.335 + 5vh (list end padding)
  const listHeight = `calc(${Math.ceil(
    posts.length / 3
  )} * (50vw * 0.34) + 5vh)`;

  return (
    <VirtuosoGrid
      ref={ref}
      style={{ width: "100%", minHeight: listHeight }}
      totalCount={posts.length}
      components={{
        List: forwardRef(({ children }, ref) => (
          <Flex ref={ref} {...styles.list}>
            {children}
          </Flex>
        )),
        Item: ({ children }) => <Flex {...styles.item}>{children}</Flex>,
      }}
      itemContent={(index) => posts[index] && <Post post={posts[index]} />}
    />
  );
};

export { Feed };

// Styles

const styles: StyleProps = {
  list: {
    wrap: "wrap",
    justify: "space-between",
  },
  item: {
    position: "relative",
    width: "100%",
    flex: { base: "1 1 32.5%", md: "1 1 32.5%" },
    maxWidth: { base: "32.5%", md: "32.5%" },
    marginBottom: { base: "1.5%", md: "1%" },
  },
};
