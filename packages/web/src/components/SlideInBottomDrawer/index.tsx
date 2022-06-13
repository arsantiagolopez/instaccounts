import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { StyleProps } from "../../types";

interface Props {
  /* Trigger component that opens drawer */
  trigger: JSX.Element;
  /* Header to diplay on top of drawer */
  header?: string;
  /* Submit component to call success function */
  submit: JSX.Element;
  /* Content to be displayed inside DrawerContent */
  children: JSX.Element;
  /* State for when button is loading and should be inactive */
  isLoading: boolean;
  /* Success boolean when drawer should be closed */
  onSuccess: boolean;
}

const SlideInBottomDrawer: FC<Props> = ({
  trigger,
  header,
  submit,
  children,
  isLoading,
  onSuccess,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Listen to close drawer on success
  useEffect(() => onClose(), [onSuccess]);
  return (
    <>
      <Button onClick={onOpen} {...styles.button}>
        {trigger}
      </Button>
      <Drawer onClose={onClose} isOpen={isOpen} {...styles.drawer}>
        <DrawerOverlay />
        <DrawerContent {...styles.content}>
          <DrawerHeader {...styles.header}>{header}</DrawerHeader>
          <DrawerBody {...styles.body}>{children}</DrawerBody>
          <Button isDisabled={isLoading} {...styles.submit}>
            {submit}
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { SlideInBottomDrawer };

// Styles

const styles: StyleProps = {
  button: {
    variant: "unstyled",
    height: "fit-content",
    width: "auto",
  },
  drawer: {
    placement: "bottom",
  },
  content: {
    borderRadius: "0.25em",
    width: { base: "90vw", md: "30vw" },
    marginX: "auto",
    marginBottom: { base: "11vh", md: "15vh" },
    minHeight: "fit-content",
    paddingBottom: { base: "3vh", md: "5vh" },
  },
  header: {
    paddingTop: { base: "2vh", md: "3vh" },
    paddingX: { base: "2em", md: "3vw" },
    alignSelf: "center",
  },
  body: {
    paddingX: { base: "2em", md: "3vw" },
  },
  submit: {
    position: "absolute",
    bottom: { base: "-8vh", md: "-10vh" },
    variant: "unstyled",
    marginTop: "2vh",
    background: "white",
    color: "gray.800",
    height: "auto",
    minHeight: { base: "3.5em", md: "4em" },
    _hover: {
      background: "gray.100",
    },
    _active: {
      background: "gray.100",
    },
  },
};
