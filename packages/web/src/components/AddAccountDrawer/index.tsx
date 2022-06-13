import { Flex, Input, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { KeyedMutator } from "swr";
import { Instagram, StyleProps } from "../../types";
import { handleMutation } from "../../utils/handleMutation";
import { showToast } from "../../utils/showToast";
import { SlideInBottomDrawer } from "../SlideInBottomDrawer";

interface Props {
  children: JSX.Element;
  accounts?: Instagram[];
  mutate: KeyedMutator<Instagram[]>;
}

interface FormData {
  username: string;
  password: string;
}

const AddAccountDrawer: FC<Props> = ({ children, accounts, mutate }) => {
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  // Add account & mutate for better UI
  const createAccount = async (args: FormData): Promise<boolean> => {
    const success = true;
    const { data, error } = await handleMutation("/instagrams", args);

    if (error) {
      showToast({ status: "error", title: error });
      return !success;
    }

    setOnSuccess(true);
    mutate([...[accounts], data]);
    return success;
  };

  // Authorize recently created account
  const authorizeAccount = async (args: FormData): Promise<boolean> => {
    const success = true;
    const { data, error } = await handleMutation("/instagrams/authorize", args);

    if (error) {
      showToast({ status: "error", title: error });
      return !success;
    }

    // Logged in successfully
    if (data) mutate([...[accounts], data]);

    return success;
  };

  // Fetch & populate recently created account
  const downloadProfile = async (args: FormData): Promise<void> => {
    const { data, error } = await handleMutation("/instagrams/download", args);

    if (error) showToast({ status: "error", title: error });
    // Data successfully downloaded
    if (data) mutate([...[accounts], data]);
  };

  const onSubmit = async (args: FormData): Promise<void> => {
    setIsLoading(true);
    const accountCreated = await createAccount(args);
    if (!accountCreated) {
      setIsLoading(false);
      return;
    }

    const accountAuthorized = await authorizeAccount(args);
    if (!accountAuthorized) {
      setIsLoading(false);
      return;
    }

    await downloadProfile(args);
    setIsLoading(false);
  };

  // Form fields registration
  const usernameRegister: UseFormRegisterReturn = register("username", {
    required: "What's your username?",
    pattern: {
      value: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      message: "Must be a valid username.",
    },
  });
  const passwordRegister: UseFormRegisterReturn = register("password", {
    required: "The password's required.",
  });

  // Reset onSuccess value for future submits
  useEffect(() => setOnSuccess(false), [accounts]);

  return (
    <SlideInBottomDrawer
      trigger={children}
      header="Add an account"
      submit={
        <Text onClick={handleSubmit(onSubmit)} {...styles.submit}>
          {isLoading ? "Adding Account..." : "Add Account"}
        </Text>
      }
      isLoading={isLoading}
      onSuccess={onSuccess}
    >
      <form>
        <Flex {...styles.field}>
          <Input
            placeholder="Your username"
            spellCheck="false"
            {...styles.input}
            {...usernameRegister}
          />
          {errors.username && (
            <Text {...styles.error}>{errors.username.message}</Text>
          )}
        </Flex>
        <Flex {...styles.field}>
          <Input
            placeholder="Your password"
            type="password"
            {...styles.input}
            {...passwordRegister}
          />
          {errors.password && (
            <Text {...styles.error}>{errors.password.message}</Text>
          )}
        </Flex>
      </form>
    </SlideInBottomDrawer>
  );
};

export { AddAccountDrawer };

// Styles

const styles: StyleProps = {
  trigger: {
    position: "absolute",
    fontSize: "10pt",
    marginTop: "2vh",
    fontWeight: "normal",
  },
  input: {},
  field: {
    direction: "column",
    marginTop: "2vh",
  },
  error: {
    fontSize: "10pt",
    color: "red.500",
    paddingTop: "0.75vh",
    lineHeight: "1.25em",
  },
  submit: {
    paddingY: { base: "1em", md: "1.25em" },
    borderRadius: "0.25em",
  },
};
