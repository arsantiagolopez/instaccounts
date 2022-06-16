import {
  Avatar,
  Button,
  Flex,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import axios from "../../../../axios";
import { Preferences, StyleProps } from "../../../../types";
import { useAccounts } from "../../../../utils/useAccounts";
import { TagSelect } from "../../../TagSelect";

interface Props {
  handleNavigation: (tab: string) => void;
}

const Preferences: FC<Props> = ({ handleNavigation }) => {
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { active } = useAccounts();
  const { username } = active || {};

  const { data: preferences, mutate } = useSWR<Preferences>(
    username &&
      `${process.env.NEXT_PUBLIC_API_URL}/bots/preferences/${username}`
  );

  const { handleSubmit, watch, setValue, getValues, control } =
    useForm<Preferences>();

  // Handle submit
  const onSubmit = async (values: Preferences) => {
    if (active) {
      setIsLoading(true);

      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/bots/preferences`,
          { ...values, username }
        );

        mutate(data);
      } catch (err) {
        console.log("Something went wrong.");
      }

      setIsLoading(false);
    }
  };

  // Compare two arrays, return true if arrays are different, false if same
  const arraysAreDifferent = (arr1: string[], arr2: string[]): boolean => {
    const a = arr1.sort();
    const b = arr2.sort();
    const areEqual = a.length === b.length && a.every((v, i) => v === b[i]);
    return !areEqual;
  };

  // Compare changes & update hasChanges
  useEffect(() => {
    if (preferences && watch()) {
      const { hashtags, competitors, locations } = preferences;

      // Set default values to API
      if (typeof watch("hashtags") === "undefined") {
        setValue("hashtags", hashtags);
        setValue("competitors", competitors);
        setValue("locations", locations);
      }

      const {
        hashtags: currentHashtags,
        competitors: currentCompetitors,
        locations: currentLocations,
      } = getValues();

      const hashtagHasChanges = arraysAreDifferent(hashtags, currentHashtags);

      if (hashtagHasChanges) setHasChanges(true);

      const competitorsHasChanges = arraysAreDifferent(
        competitors,
        currentCompetitors
      );

      if (competitorsHasChanges) setHasChanges(true);

      const locationHasChanges = arraysAreDifferent(
        locations,
        currentLocations
      );

      if (locationHasChanges) setHasChanges(true);

      // If no changes, update state
      if (!hashtagHasChanges && !competitorsHasChanges && !locationHasChanges)
        setHasChanges(false);
    }
  }, [preferences, watch()]);

  const tagSelectProps = { control };
  const hashtagsProps = {
    name: "hashtags" as keyof Preferences,
    placeholder: "Hashtags",
  };
  const competitorsProps = {
    name: "competitors" as keyof Preferences,
    placeholder: "Competitors",
  };
  const locationsProps = {
    name: "locations" as keyof Preferences,
    placeholder: "Locations",
  };

  return (
    <Flex {...styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Account */}
        <Flex {...styles.field}>
          <Flex {...styles.left}>
            <Avatar src={active?.image} {...styles.avatar} />
          </Flex>
          <Flex {...styles.instagram}>
            <Text {...styles.username}>{active?.username}</Text>
            <Link href="/accounts">
              <Text {...styles.link}>Change Account</Text>
            </Link>
          </Flex>
        </Flex>

        {/* Hashtags */}
        <Flex {...styles.field}>
          <Flex {...styles.left}>
            <Text {...styles.heading}>Hashtags</Text>
          </Flex>

          <Flex {...styles.right}>
            <TagSelect {...hashtagsProps} {...tagSelectProps} />
            <Text {...styles.helper}>Hashtags you want to interact with.</Text>
          </Flex>
        </Flex>

        {/* Competitors */}
        <Flex {...styles.field}>
          <Flex {...styles.left}>
            <Text {...styles.heading}>Competitors</Text>
          </Flex>

          <Flex {...styles.right}>
            <TagSelect {...competitorsProps} {...tagSelectProps} />
            <Text {...styles.helper}>
              Have a specific demographic you're targeting? Find users you
              similar to you and interact with their followers.
            </Text>
          </Flex>
        </Flex>

        {/* Locations */}
        <Flex {...styles.field}>
          <Flex {...styles.left}>
            <Text {...styles.heading}>Locations</Text>
          </Flex>

          <Flex {...styles.right}>
            <TagSelect {...locationsProps} {...tagSelectProps} />
            <Text {...styles.helper}>
              Interact with users from a specific location. You need to include
              the location ID, find some on this{" "}
              <ChakraLink
                href="https://www.instagram.com/explore/locations/"
                isExternal
                {...styles.externalLink}
              >
                link
              </ChakraLink>
              , or learn how to extract them from the{" "}
              <ChakraLink
                onClick={() => handleNavigation("help")}
                {...styles.externalLink}
              >
                Help
              </ChakraLink>{" "}
              tab on the left.
            </Text>
          </Flex>
        </Flex>

        {/* Run button */}
        <Flex {...styles.field}>
          <Flex {...styles.left}></Flex>
          <Flex {...styles.right} {...styles.fixed}>
            {hasChanges ? (
              <Button
                type="submit"
                disabled={isLoading}
                {...styles.pulseAnimation}
              >
                Save changes
              </Button>
            ) : (
              <Button onClick={() => handleNavigation("status")}>
                Run the bot
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export { Preferences };

// Styles

const styles: StyleProps = {
  wrapper: {
    position: "relative",
    direction: "column",
    height: "80vh",
  },
  field: {
    direction: "row",
    width: "100%",
    paddingY: "0.5rem",
  },
  left: {
    width: "25%",
    justifyContent: "right",
    paddingRight: "4%",
    minWidth: "5rem",
  },
  avatar: {
    boxSize: "2.3rem",
    marginY: "auto",
  },
  instagram: {
    direction: "column",
    letterSpacing: "-0.5px",
  },
  username: {
    fontSize: "xl",
    fontWeight: "500",
    color: "black",
    letterSpacing: "-0.25px",
  },
  link: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "blue.400",
    marginTop: "-0.25rem",
    cursor: "pointer",
  },
  heading: {
    fontWeight: "bold",
    letterSpacing: "-0.5px",
    paddingTop: "0.3rem",
  },
  right: {
    direction: "column",
    maxWidth: "18rem",
  },
  helperHeading: {
    color: "gray.400",
    fontSize: "9pt",
    fontWeight: "bold",
    letterSpacing: "tight",
    paddingTop: "0.5rem",
  },
  helper: {
    color: "gray.400",
    fontSize: "9pt",
    fontWeight: "500",
    letterSpacing: "tight",
    paddingTop: "0.25rem",
    lineHeight: "1rem",
  },
  externalLink: {
    color: "blue.400",
    fontWeight: 600,
  },
  fixed: {
    position: "absolute",
    left: "max(5rem, 25%)",
    bottom: "2em",
  },
  pulseAnimation: {
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
};
