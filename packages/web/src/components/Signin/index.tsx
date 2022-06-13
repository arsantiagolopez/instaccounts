import { Flex } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { StyleProps } from "../../types";
import { Logo } from "../Logo";
import { EmailSent } from "./EmailSent";
import { Form } from "./Form";

interface Props {}

const Signin: FC<Props> = () => {
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const formProps = { setIsEmailSent, setEmail };
  const emailSentProps = { setIsEmailSent, email };

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.content}>
        <Flex {...styles.image}>
          <Logo />
        </Flex>

        {!isEmailSent ? (
          <Form {...formProps} />
        ) : (
          <EmailSent {...emailSentProps} />
        )}
      </Flex>
    </Flex>
  );
};

export { Signin };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    minHeight: "100vh",
    background: { base: "none", md: "rgba(250,250,250,0.5)" },
  },
  content: {
    direction: "column",
    align: "center",
    padding: { base: "3em", md: "3vw" },
    minHeight: "50vh",
    width: { base: "100%", md: "22vw" },
    minWidth: { base: "100%", md: "20em" },
    border: { base: "none", md: "1px solid" },
    borderColor: { base: "none", md: "gray.100" },
    borderRadius: "0.25em",
    marginX: "auto",
    marginY: { base: "10vh", md: "20vh" },
    bg: "white",
  },
  image: {
    position: "relative",
    width: { base: "55vw", md: "13vw" },
    height: { base: "5vh", md: "5vh" },
    marginBottom: { base: "7vh", md: "7vh" },
  },
};
