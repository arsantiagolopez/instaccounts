import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useContext, useState } from "react";
import axios from "../../axios";
import { AppContext } from "../../context/AppContext";
import { App, StyleProps } from "../../types";
import { showToast } from "../../utils/showToast";

interface Props {
  app: App;
}

const ManageAppDrawer: FC<Props> = ({ app }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { apps, setApps, mutate } = useContext(AppContext);

  const { id, name, isActive } = app;

  const toggleDisable = async (): Promise<void> => {
    setIsLoading(true);
    const toggledState = { isActive: !isActive };
    const updatedApp = { ...app, ...toggledState };
    const updatedApps = apps.map((appObj) =>
      appObj.id === id ? updatedApp : appObj
    );
    setApps(updatedApps);

    const { status } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/apps/${id}`,
      toggledState
    );

    // Update UI
    mutate(updatedApps);

    if (status !== 200) console.log("something went wrong");

    // Close & Show success toast
    setIsLoading(false);
    onClose();
    showToast({
      status: "success",
      title: `${name} is ${!isActive ? "active" : "now disabled"}.`,
    });
  };

  return (
    <>
      <Text onClick={onOpen} {...styles.trigger}>
        Manage
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} {...styles.modal}>
        <ModalOverlay {...styles.overlay} />
        <ModalContent {...styles.content}>
          <ModalHeader {...styles.header}>{name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody {...styles.body}>
            Active
            <Switch
              id={name}
              isChecked={isActive}
              isDisabled={isLoading}
              onChange={toggleDisable}
              {...styles.switch}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export { ManageAppDrawer };

// Styles

const styles: StyleProps = {
  trigger: {
    fontSize: "9pt",
    color: "blue.400",
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: "tight",
  },
  modal: {},
  overlay: {
    backdropFilter: "blur(2px)",
  },
  content: {
    paddingY: "1vh",
  },
  header: {},
  body: {
    padding: "2vh",
  },
  switch: {
    marginLeft: "3",
    colorScheme: "green",
    size: "md",
  },
};
