import { Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import axios from "../axios";

interface Props {}

const TestPage: NextPage<Props> = () => {
  const handleClick = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/instagrams/test`
    );

    console.log(response);
    //   let username = "asantilopez";
    //   const { data, error } = await handleMutation("/instagrams/test", {
    //     username,
    //   });

    //   if (error) {
    //     console.log("*** error:", error);
    //   }

    //   if (data) {
    //     console.log("*** data:", data);
    //   }
    // };
  };

  return (
    <Flex direction="column">
      <Button onClick={handleClick}>Test</Button>
    </Flex>
  );
};

export default TestPage;
