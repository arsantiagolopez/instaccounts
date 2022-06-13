import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import React, { FC } from "react";
import { StyleProps } from "../../types";

interface Props {}

const Footer: FC<Props> = () => {
  const links: any = [
    {
      name: "Github",
      href: "https://github.com/arsantiagolopez",
    },
    {
      name: "Portfolio",
      href: "https://www.alexandersantiago.com/",
    },
    {
      name: "Santi Codes",
      href: "https://santicodes.me",
    },
  ];

  const year = moment().year();

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.link}>
        {links.map(({ name, href }: any, index: number) => (
          <Flex key={name}>
            <Link href={href}>
              <Text {...styles.link}>{name}</Text>
            </Link>
            {index !== links.length - 1 && (
              <Text {...styles.separator}>&#11825;</Text>
            )}
          </Flex>
        ))}
      </Flex>
      <Text {...styles.link} {...styles.copyright}>
        &#169; {year} Coded with ❤️ by Alex
      </Text>
    </Flex>
  );
};

export { Footer };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    width: "100%",
    paddingY: { base: "1em", md: "3vh" },
  },
  links: {
    direction: "row",
  },
  link: {
    wrap: "wrap",
    color: "gray.300",
    fontSize: "9pt",
    fontWeight: "500",
    letterSpacing: "tight",
    cursor: "pointer",
    isTruncated: true,
  },
  separator: {
    paddingX: "0.5",
  },
  copyright: {
    fontWeight: "500",
    paddingY: { base: "1em", md: "2vh" },
    letterSpacing: "tighter",
    cursor: "default",
  },
};
