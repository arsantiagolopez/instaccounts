import { Flex, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { StyleProps } from "../../../../types";
import { useSocket } from "../../../../utils/useSocket";

interface Props {}

const Logs: FC<Props> = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen to incoming logs
      const logListener = (log: string) => {
        setLogs((logs) => [log, ...logs]);
      };

      // Listen to events
      socket.on("handleLog", logListener);

      // Clean up
      return () => {
        socket.off("handleLog", logListener);
      };
    }
  }, [socket]);

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.logs}>
        {logs.map((log, index) => (
          <Text key={index} {...styles.log}>
            {log}
          </Text>
        ))}
      </Flex>
    </Flex>
  );
};

export { Logs };

// Styles

const styles: StyleProps = {
  wrapper: {
    marginY: "1em",
    paddingY: "0.25rem",
    borderRadius: "md",
    border: { base: "none", md: "1px solid" },
    borderColor: { base: "none", md: "gray.200" },
    height: "100%",
    minHeight: "70vh",
    maxHeight: "70vh",
    overflow: "scroll",
  },
  logs: {
    direction: "column-reverse",
    alignItems: "start",
    cursor: "default",
    width: "100%",
    height: "100%",
  },
  log: {
    wordBreak: "break-word",
    paddingX: "0.5rem",
    paddingY: "0.25rem",
    fontSize: "9pt",
    lineHeight: "1.2em",
    width: "100%",
    height: "100%",
    _hover: {
      background: "gray.50",
    },
  },
};
