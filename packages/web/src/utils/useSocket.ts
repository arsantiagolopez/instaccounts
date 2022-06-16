import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // Start a websocket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);

    setSocket(newSocket);

    // Clean up websocket
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return { socket };
};

export { useSocket };
