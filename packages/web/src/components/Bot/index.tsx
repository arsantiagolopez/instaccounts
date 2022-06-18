import {
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";
import { NavigationDrawer } from "./NavigationDrawer";
import { Help, Preferences, Status } from "./Tabs";

interface Props {}

interface Tab {
  id: string;
  label: string;
  Component: JSX.Element;
}

const Bot: FC<Props> = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const { active } = useAccounts();

  // Navigate to a different tab
  const handleNavigation = (tab: string): void => {
    const index = tabs.findIndex(({ id }) => tab === id);
    setTabIndex(index);
  };

  const tabProps = { handleNavigation };

  const tabs: Tab[] = [
    {
      id: "preferences",
      label: "Preferences",
      Component: <Preferences {...tabProps} />,
    },
    {
      id: "status",
      label: "Status",
      Component: <Status {...tabProps} />,
    },
    {
      id: "help",
      label: "Help",
      Component: <Help {...tabProps} />,
    },
  ];

  const activeTabName = tabs[tabIndex].label;

  const navigationDrawerProps = { tabs, tabIndex, handleNavigation };

  if (!active) {
    return <Flex {...styles.wrapper}></Flex>;
  }

  return (
    <Flex {...styles.wrapper}>
      {/* Mobile Navigation */}
      <NavigationDrawer
        Trigger={
          <Flex {...styles.navigation}>
            <Icon as={IoChevronBackSharp} {...styles.icon} />
            <Text {...styles.title}>{activeTabName}</Text>
          </Flex>
        }
        {...navigationDrawerProps}
      />

      <Tabs
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
        {...styles.tabs}
      >
        {/* Tabs */}
        <TabList {...styles.list}>
          {tabs.map(({ label }) => (
            <Tab key={label} {...styles.tab}>
              {label}
            </Tab>
          ))}
        </TabList>

        {/* Panels */}
        <TabPanels {...styles.panels}>
          {tabs.map(({ label, Component }) => (
            <TabPanel key={label} {...styles.panel}>
              {Component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export { Bot };

// Styles

const styles: StyleProps = {
  wrapper: {
    direction: "column",
    marginX: { base: "0", md: "25vw" },
    height: "85vh",
    marginTop: { base: "0", md: "4vh" },
    marginBottom: "0.75em",
    background: "white",
    border: { base: "none", md: "1px solid" },
    borderColor: { base: "none", md: "gray.200" },
    borderRadius: "0.25em",
  },
  tabs: {
    orientation: "vertical",
    variant: "unstyled",
  },
  list: {
    display: { base: "none", md: "block" },
    borderRight: { base: "none", md: "1px solid" },
    borderRightColor: { base: "none", md: "gray.200" },
    height: "85vh",
  },
  tab: {
    display: "flex",
    justifyContent: "start",
    width: "12rem",
    fontWeight: "500",
    letterSpacing: "-0.25px",
    paddingY: "0.75rem",
    color: "black",
    paddingX: "1.5rem",
    _selected: {
      fontWeight: "700",
      borderLeft: "2px",
      paddingLeft: "1.4rem",
      _hover: {
        borderColor: "black",
        background: "none",
      },
    },
    _hover: {
      borderLeft: "2px",
      borderColor: "gray.300",
      background: "gray.50",
      paddingLeft: "1.4rem",
    },
  },
  panels: {},
  panel: {},
  // Mobile styles
  navigation: {
    display: { base: "flex", md: "none" },
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.3rem",
  },
  title: {
    fontWeight: "semibold",
    fontSize: "lg",
  },
  icon: {
    position: "absolute",
    left: "0.5rem",
    fontSize: "1rem",
  },
};
