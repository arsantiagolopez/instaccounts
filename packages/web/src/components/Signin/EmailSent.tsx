import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import FadeIn from "react-fade-in";
import { SiMinutemailer } from "react-icons/si";
import { StyleProps } from "../../types";

interface Props {
  setIsEmailSent: (isEmailSent: boolean) => void;
  email: string | null;
}

const EmailSent: FC<Props> = ({ setIsEmailSent, email }) => {
  return (
    <Flex {...styles.wrapper}>
      <FadeIn delay={300}>
        <Icon as={SiMinutemailer} {...styles.icon} />
        <Heading {...styles.heading}>Check your inbox!</Heading>
        <Flex {...styles.text}>
          <Text>We&apos;ve sent a sign in link to {email} </Text>
          <Text>
            Can&apos;t find it? Try your <b>spam folder.</b>
          </Text>
        </Flex>

        <Flex {...styles.links}>
          <Button onClick={() => setIsEmailSent(false)} {...styles.link}>
            It&apos;s not there. Send me another one.
          </Button>
          <Button onClick={() => setIsEmailSent(false)} {...styles.link}>
            Go back
          </Button>
        </Flex>
      </FadeIn>
    </Flex>
  );
};

export { EmailSent };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    justify: "center",
    align: "center",
    width: "100%",
    textAlign: "center",
    lineHeight: "1.5em",
  },
  icon: {
    fontSize: "5em",
    color: "gray.200",
    marginBottom: "3",
    marginTop: { base: "0", md: "-2vh" },
  },
  heading: {
    size: "lg",
  },
  text: {
    direction: "column",
    paddingY: "2vh",
    fontSize: "10pt",
  },
  links: {
    direction: "column",
    paddingY: { base: "3vh", md: "1vh" },
  },
  link: {
    variant: "link",
    marginY: "1",
  },
};
