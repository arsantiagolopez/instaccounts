import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
// import axios from "../../axios";
import { StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";

interface Props {
  Trigger: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  setPassword: Dispatch<SetStateAction<boolean | string>>;
}

interface FormData {
  password: string;
}

const PasswordConfirmationModal: FC<Props> = ({
  Trigger,
  isOpen,
  onClose,
  setPassword,
}) => {
  const { active } = useAccounts();

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit = async ({ password }: FormData): Promise<void> => {
    setPassword(password);
    onClose();
  };

  // Form field registration
  const passwordRegister: UseFormRegisterReturn = register("password", {
    required: "What's your instagram password?",
  });

  return (
    <>
      {/* Trigger */}
      {Trigger}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} {...styles.modal} isCentered>
        <ModalOverlay {...styles.overlay} />
        <ModalContent {...styles.content}>
          <ModalHeader {...styles.header}>
            Confirm your Instagram password
          </ModalHeader>
          <ModalBody {...styles.body}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder={`${active?.username}'s password`}
                {...styles.input}
                {...passwordRegister}
              />
              {errors.password && (
                <Text {...styles.error}>{errors.password.message}</Text>
              )}

              <Button isDisabled={!watch("password")} {...styles.start}>
                Start the bot
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export { PasswordConfirmationModal };

// Styles

const styles: StyleProps = {
  wrapper: {},
  modal: {},
  overlay: {
    backdropFilter: "blur(2px)",
  },
  content: {
    minHeight: "20vh",
    maxWidth: "20em",
  },
  header: {
    paddingX: 0,
    paddingY: "0.5rem",
    textAlign: "center",
    fontSize: "md",
    borderBottom: "1px",
    borderColor: "gray.200",
    fontWeight: 700,
  },
  body: {
    padding: "2em",
  },
  field: {
    direction: "column",
    paddingX: { base: "1em", md: "1rem" },
  },
  input: {
    type: "password",
  },
  error: {
    fontSize: "10pt",
    color: "red.500",
    paddingTop: "0.75vh",
    lineHeight: "1.25em",
  },
  start: {
    marginTop: "1.5em",
    type: "submit",
  },
};
