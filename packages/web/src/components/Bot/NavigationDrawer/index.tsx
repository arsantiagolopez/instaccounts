import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { StyleProps } from "../../../types";

interface Props {
  Trigger: ReactNode;
  tabs: Tab[];
  tabIndex: number;
  handleNavigation: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
  Component: JSX.Element;
}

const NavigationDrawer: FC<Props> = ({
  Trigger,
  tabs,
  tabIndex,
  handleNavigation,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const activeTabId = tabs[tabIndex].id;

  const navigateAndCloseDrawer = (id: string) => {
    // Navitate to tab
    handleNavigation(id);

    // Close modal
    onClose();
  };

  return (
    <>
      {/* Trigger */}
      <Button onClick={onOpen} {...styles.trigger}>
        {Trigger}
      </Button>

      {/* Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        {...styles.drawer}
      >
        <DrawerOverlay />
        <DrawerContent {...styles.content}>
          <Flex onClick={onClose} {...styles.navigation}>
            <Icon as={IoChevronBackSharp} {...styles.icon} />
            <Text {...styles.title}>Bot Menu</Text>
          </Flex>

          <DrawerBody {...styles.body}>
            <Flex {...styles.tabs}>
              {tabs.map(({ id, label }) => (
                <Text
                  key={id}
                  onClick={() => navigateAndCloseDrawer(id)}
                  fontWeight={id === activeTabId ? "bold" : "base"}
                  {...styles.tab}
                >
                  {label}
                </Text>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { NavigationDrawer };

// Styles

const styles: StyleProps = {
  trigger: {
    variant: "unstyled",
    height: "4.5rem",
  },
  drawer: {
    placement: "left",
    size: "full",
  },
  content: {},
  body: {
    paddingX: "1rem",
  },
  tabs: {
    direction: "column",
    fontSize: "xl",
  },
  tab: {
    paddingY: "0.5rem",
  },
  // Mobile styles
  navigation: {
    display: { base: "flex", md: "none" },
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.3rem",
    paddingY: "0.6rem",
    borderBottom: "0.5px solid",
    borderColor: "gray.300",
  },
  title: {
    fontWeight: "semibold",
    fontSize: "lg",
  },
  icon: {
    position: "absolute",
    left: "1rem",
    fontSize: "1.5rem",
  },
};
