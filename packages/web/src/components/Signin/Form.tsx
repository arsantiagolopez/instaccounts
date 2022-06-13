import { Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import React, { FC } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { StyleProps } from "../../types";
import { RequestInvite } from "./RequestInvite";

interface Props {
  setIsEmailSent: (isEmailSent: boolean) => void;
  setEmail: (email: string) => void;
}

interface FormData {
  email: string;
}

const Form: FC<Props> = ({ setIsEmailSent, setEmail }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  // Send magic link email
  const onSubmit = ({ email }: FormData): void => {
    signIn("email", { email, redirect: false });
    setIsEmailSent(true);
    setEmail(email);
  };

  // Form field registration
  const emailRegister: UseFormRegisterReturn = register("email", {
    required: "What's your email?",
    pattern: {
      // Minimal email validation
      value: /\S+@\S+\.\S+/,
      message: "Please input a valid email address",
    },
  });

  return (
    <Flex {...styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button onClick={() => signIn("google")} leftIcon={<FaGoogle />}>
          Continue with Google
        </Button>

        <Flex {...styles.separation}>
          <Divider />
          <Text {...styles.or}> OR </Text>
          <Divider />
        </Flex>

        <Flex {...styles.field}>
          <Input
            placeholder="Your email"
            {...styles.input}
            {...emailRegister}
          />
          {errors.email && (
            <Text {...styles.error}>{errors.email.message}</Text>
          )}
        </Flex>

        <Button isDisabled={!watch("email")} {...styles.login}>
          Send login link
        </Button>
      </form>

      <RequestInvite />
    </Flex>
  );
};

export { Form };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    width: "100%",
  },
  separation: {
    direction: "row",
    paddingY: "3vh",
    align: "center",
    width: "100%",
  },
  or: {
    color: "gray.400",
    fontWeight: "normal",
    fontSize: "10pt",
    size: "sm",
    marginX: { base: "1em", md: "1vw" },
  },
  field: {
    direction: "column",
    marginBottom: "3vh",
  },
  input: {},
  error: {
    fontSize: "10pt",
    color: "red.500",
    paddingTop: "0.75vh",
    lineHeight: "1.25em",
  },
  login: {
    type: "submit",
  },
};
