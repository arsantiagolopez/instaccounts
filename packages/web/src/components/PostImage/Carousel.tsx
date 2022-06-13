import { Flex, Icon } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC, useState } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { StyleProps } from "../../types";

interface Props {
  image: string;
  carouselImages?: string[];
}

const Carousel: FC<Props> = ({ image, carouselImages }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleNext = (num: number): void => {
    setActiveIndex(activeIndex + num);
  };

  const isLeftEnd = activeIndex < 1;
  const isRightEnd =
    carouselImages && activeIndex >= carouselImages?.length - 1;

  const imagePath = carouselImages ? carouselImages[activeIndex] : image;

  return (
    <Flex {...styles.wrapper}>
      <Image
        // src={`${process.env.NEXT_PUBLIC_API_URL}${imagePath}`}
        src={imagePath}
        layout="fill"
        objectFit="cover"
        quality={100}
        priority={true}
      />

      <Flex {...styles.actions}>
        <Icon
          onClick={() => handleNext(-1)}
          as={IoIosArrowDropleftCircle}
          display={isLeftEnd ? "none" : "block"}
          {...styles.left}
          {...styles.button}
        />
        <Icon
          onClick={() => handleNext(1)}
          as={IoIosArrowDroprightCircle}
          display={isRightEnd ? "none" : "block"}
          {...styles.right}
          {...styles.button}
        />
      </Flex>
    </Flex>
  );
};

export { Carousel };

// Styles

const styles: StyleProps = {
  wrapper: {
    position: "relative",
    overflowX: "hidden",
  },
  aspect: {
    minWidth: { base: "100vw", md: "calc(100vw - 10vw - 10vw - 32vw)" },
  },
  skeleton: {
    width: "100%",
    height: "100%",
  },
  actions: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  button: {
    color: "white",
    fontSize: { base: "1.75em", md: "2em" },
    cursor: "pointer",
    opacity: 0.8,
  },
  left: {
    alignSelf: "center",
    marginRight: "auto",
    marginLeft: { base: "0.25em", md: "0.5em" },
  },
  right: {
    alignSelf: "center",
    marginLeft: "auto",
    marginRight: { base: "0.25em", md: "0.5em" },
  },
};
