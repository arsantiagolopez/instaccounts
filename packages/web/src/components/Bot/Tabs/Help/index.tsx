import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { StyleProps } from "../../../../types";

interface Props {}

const Help: FC<Props> = () => {
  return (
    <Flex {...styles.wrapper}>
      <Accordion allowToggle {...styles.accordion}>
        <AccordionItem {...styles.item}>
          <AccordionButton {...styles.button}>
            How it works
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel {...styles.panel}>
            <Text {...styles.text}>
              Choose your preferences in the{" "}
              <span style={styles.bold}>Preferences</span> tab. Fill it out as
              best as you can to best interact with your demographic. Hashtags,
              competitors, locations. Click the run button.
              <br />
              <br />
              Have you ever navigated instagram from your computer? It's much
              like doing it through the phone. You can like, comment, follow,
              unfollow, send messages. Almost everything to the dot. The way the
              bot works is, a script will run on the background, controlling the
              browser pretending to be you: a real human interacting with other
              users. Every interaction is separated by random second intervals,
              taking into account Instagram's limits and preventing you from
              getting banned.
              <br />
              <br />
              <Link
                href="https://github.com/InstaPy/InstaPy"
                {...styles.externalLink}
              >
                InstaPy
              </Link>{" "}
              is the script being used behind the scenes. It's a fantastic
              library with many contributors, still being maintained and funded
              throughout the years. New feautures have been coming out and I
              don't expect it to be deprecated any time soon.
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem {...styles.item}>
          <AccordionButton {...styles.button}>
            How to get location tags
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel {...styles.panel}>
            <Text {...styles.text}>
              • Find locations from this{" "}
              <Link
                href="https://www.instagram.com/explore/locations/"
                isExternal
                {...styles.externalLink}
              >
                link
              </Link>
              .
              <br />• Find the location you want and get the URL link in the
              format:{" "}
              https://www.instagram.com/explore/locations/1939771852939956/downtown-austin/
              <br />• Extract everything after{" "}
              <span style={styles.bold}>'locations/'</span> or just the number.
              <br />• E.g. From the link above, you'd extract{" "}
              <span style={styles.bold}>
                1939771852939956/downtown-austin
              </span>{" "}
              or just <span style={styles.bold}>1939771852939956</span> and add
              it as a location tag.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

// Styles

const styles: StyleProps = {
  wrapper: {
    width: "100%",
    fontSize: "sm",
    letterSpacing: "tight",
    height: { base: "calc(100vh - 8em)", md: "80vh" },
  },
  accordion: {
    width: "100%",
  },
  item: {
    width: "100%",
    borderTopWidth: "0px",
    borderBottomWidth: "0.5px",
  },
  button: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontWeight: "semibold",
    letterSpacing: "-0.5px",
    paddingY: "1em",
  },
  panel: {
    width: "100%",
    maxWidth: { base: "100vw", md: "33vw" },
    pb: 4,
  },
  text: {
    color: "base",
    fontSize: { base: "md", md: "sm" },
    lineHeight: { base: "base", md: "1.2rem" },
  },
  externalLink: {
    color: "blue.400",
    fontWeight: 600,
  },
  bold: {
    color: "black",
    fontWeight: 500,
  },
};

export { Help };
