import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { KeyedMutator } from "swr";
import axios from "../../axios";
import { Instagram, StyleProps } from "../../types";
import { showToast } from "../../utils/showToast";

interface Props {
  /* Username of account to delete */
  username: string;
  /* Trigger component button to delete account */
  trigger: JSX.Element;
  /* Toggle delete alert state */
  setIsDeleteAlertOpen?: Dispatch<SetStateAction<boolean>>;
  /* Accounts array to mutate on new delete */
  accounts?: Instagram[];
  /* Accounts mutate key to update cache */
  mutate: KeyedMutator<Instagram[]>;
}

const DeleteAccount: FC<Props> = ({
  username,
  trigger,
  setIsDeleteAlertOpen,
  accounts,
  mutate,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  // Remove account & delete all files
  const handleDelete = async (): Promise<void> => {
    setIsLoading(true);

    const { data }: AxiosResponse = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/instagrams/${username}`
    );

    if (data) {
      const accountsWithoutDeleted = accounts?.filter(
        ({ username }) => username !== data?.username
      );
      mutate(accountsWithoutDeleted);

      setIsLoading(false);
      showToast({
        status: "error",
        title: `Account @${username} deleted.`,
      });
    } else {
      // Show error toast
      showToast({
        status: "error",
        title: "Something went wrong. Please try again later.",
      });
    }

    // Close modal
    onClose();
  };

  // If isDeleteAlertOpen passed, parent component wants
  // to know when alert is open/closed
  useEffect(() => {
    if (setIsDeleteAlertOpen) {
      if (isOpen) setIsDeleteAlertOpen(true);
      else setIsDeleteAlertOpen(false);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Alert trigger */}
      <Flex onClick={onOpen} {...styles.trigger}>
        {trigger}
      </Flex>

      {/* Alert */}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        {...styles.alert}
      >
        <AlertDialogOverlay />

        <AlertDialogContent {...styles.content}>
          <AlertDialogHeader {...styles.header}>
            Account Deletion
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? Once this account is deleted, all its files and
            configs are gone for good.
          </AlertDialogBody>
          <AlertDialogFooter {...styles.footer}>
            <Button
              ref={cancelRef}
              onClick={onClose}
              background="gray.200"
              {...styles.button}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              isLoading={isLoading}
              background="red.400"
              _hover={{
                background: "red.600",
              }}
              {...styles.button}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { DeleteAccount };

// Styles

const styles: StyleProps = {
  trigger: {
    zIndex: 9999999,
  },
  alert: {
    isCentered: true,
    motionPreset: "slideInBottom",
  },
  content: {
    borderRadius: "0.5em",
    paddingX: { base: "0.5em", md: "1em" },
    paddingY: "1em",
  },
  header: {
    textAlign: "center",
    paddingY: "0.5em",
  },
  body: {
    align: "center",
  },
  footer: {
    paddingY: "1vh",
    width: { base: "100%", md: "100%" },
    marginX: "auto",
  },
  button: {
    loadingText: "Deleting",
    spinnerPlacement: "end",
    marginY: "1vh",
    marginX: "1",
    paddingY: { base: "1.5em", md: "1.75em" },
    width: "100%",
    borderRadius: "0.5em",
    color: "white",
    boxShadow: "lg",
  },
};
