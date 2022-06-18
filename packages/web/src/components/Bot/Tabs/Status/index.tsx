import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { StyleProps } from "../../../../types";
import { handleMutation } from "../../../../utils/handleMutation";
import { showToast } from "../../../../utils/showToast";
import { useAccounts } from "../../../../utils/useAccounts";
import { PasswordConfirmationModal } from "../../../PasswordConfirmationModal";
import { Logs } from "./Logs";

interface Props {}

const Status: FC<Props> = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [password, setPassword] = useState<boolean | string>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { active } = useAccounts();

  const status = isRunning ? "Running" : "Stopped";
  const action = isRunning ? "Stop" : "Start";

  // Start the bot & collect logs
  const handleRun = async (): Promise<void> => {
    setIsRunning(true);

    const { username } = active || {};

    const { error } = await handleMutation("/bots/run", { username, password });

    if (error) {
      showToast({ status: "error", title: error });
      setIsRunning(false);
    }
  };

  const getPasswordConfirmation = () =>
    !isRunning ? onOpen() : setIsRunning(false);

  // Listen for password confirmation
  useEffect(() => {
    if (password) {
      handleRun();

      // Reset password
      setPassword(false);
    }
  }, [password]);

  const passwordConfirmationModalProps = {
    isOpen,
    onClose,
    setPassword,
  };
  const logsProps = { setIsRunning };

  return (
    <Flex {...styles.wrapper}>
      {/* Status */}
      <Flex {...styles.status}>
        <Text>
          <b>Status – </b> {status}
        </Text>

        {/* Password confirmation modal */}
        <PasswordConfirmationModal
          Trigger={
            <Button
              onClick={getPasswordConfirmation}
              background={isRunning ? "red.500" : "green.400"}
              _hover={{ background: isRunning ? "red.400" : "green.500" }}
              {...styles.button}
            >
              {action}
            </Button>
          }
          {...passwordConfirmationModalProps}
        />
      </Flex>

      {/* Console */}
      {isRunning && <Logs {...logsProps} />}
    </Flex>
  );
};

export { Status };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    padding: "0.5rem",
    height: "100%",
    maxWidth: "100%",
    minHeight: { base: "80vh", md: "70vh" },
  },
  status: {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: "auto",
    paddingX: "0.75rem",
    paddingY: "0",
  },
};
