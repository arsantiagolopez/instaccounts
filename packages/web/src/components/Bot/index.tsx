import { Button, Flex } from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import React, { FC } from "react";
import axios from "../../axios";
import { StyleProps } from "../../types";
import { useAccounts } from "../../utils/useAccounts";

interface Props {}

const Bot: FC<Props> = () => {
  const { active } = useAccounts();

  const handleRun = async (): Promise<void> => {
    const { username } = active || {};
    // @todo: Get password reenter with form
    let password = "test";
    const { status, data }: AxiosResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/bot/run`,
      { username, password }
    );
    if (status !== 404) {
      console.log("*** data", data);
    }
  };

  return (
    <Flex {...styles.wrapper}>
      <Button onClick={handleRun}>Start bot</Button>
    </Flex>
  );
};

export { Bot };

// Styles

const styles: StyleProps = {
  wrapper: {},
};
