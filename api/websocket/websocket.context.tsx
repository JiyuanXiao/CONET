import React, { createContext, useEffect, useRef, useContext } from "react";
import { AuthenticationContext } from "../authentication/authentication.context";
import { MessagesContext } from "../messages/messages.context";

export const WebSocketContext = createContext({});

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthenticationContext);
  const { is_messages_initialized } = useContext(MessagesContext);

  useEffect(() => {
    const connectWebSocket = () => {
      if (user && is_messages_initialized) {
        ws.current = new WebSocket(
          `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/person/?publicKey=${process.env.EXPO_PUBLIC_PROJECT_ID}&username=${user?.username}&secret=${user?.secret}`
        );

        ws.current.onopen = () => {
          console.log("WebSocket connection opened");
        };

        ws.current.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.action === "new_message") {
            console.log(JSON.stringify(message.data, null, 2));
          }
        };

        ws.current.onclose = () => {
          console.log("WebSocket connection closed");
          // Reconnect after a delay
          setTimeout(connectWebSocket, 1000);
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket error", error);
        };
      }
    };
    connectWebSocket();
    return () => {
      ws.current?.close();
    };
  }, [user, is_messages_initialized]);

  return (
    <WebSocketContext.Provider value={{}}>{children}</WebSocketContext.Provider>
  );
};
