import { AspectRatio, Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC } from "react";
import { Post, StyleProps } from "../../types";
import { Carousel } from "./Carousel";

interface Props {
  post: Partial<Post>;
  ratio?: number | Record<string, number>;
}

interface CarouselProps {
  image: string;
  carouselImages?: string[];
}

const PostImage: FC<Props> = ({ post, ratio }) => {
  const { image, isCarousel, carouselImages } = post;

  const carouselProps: CarouselProps = { image: image!, carouselImages };

  return (
    <AspectRatio ratio={ratio ?? 1} {...styles.aspect}>
      <>
        <Skeleton {...styles.skeleton} />
        {image && isCarousel ? (
          <Carousel {...carouselProps} />
        ) : (
          image && (
            <Image
              // src={image ? `${process.env.NEXT_PUBLIC_API_URL}${image}` : ""}
              src={image}
              layout="fill"
              objectFit="cover"
              quality={100}
              priority={true}
            />
          )
        )}
      </>
    </AspectRatio>
  );
};

export { PostImage };

// Styles

const styles: StyleProps = {
  aspect: {
    width: "100%",
  },
  skeleton: {
    width: "100%",
    height: "100%",
  },
};
