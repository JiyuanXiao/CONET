import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import { AuthenticationContext } from "../authentication/authentication.context";
import { MessagesContext } from "../messages/messages.context";
import { CE_MessageProps } from "@/constants/ChatEngineObjectTypes";
import * as MessagesStorage from "@/api/messages/messages.storage";
import { useSQLiteContext } from "expo-sqlite";
import { ChatsContext } from "../chats/chats.context";

interface MessageResponseProps {
  id: number;
  message: CE_MessageProps;
}

export const WebSocketContext = createContext({});

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthenticationContext);
  const { setLastRead } = useContext(ChatsContext);
  const { is_messages_initialized, receiveMessage } =
    useContext(MessagesContext);
  const [response_message, setResponseMessage] =
    useState<MessageResponseProps | null>();
  const db = useSQLiteContext();

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
            const recevie_success = receiveMessage(
              message.data.id,
              message.data.message
            );

            if (recevie_success) {
              setResponseMessage(message.data);
            }
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

  useEffect(() => {
    if (response_message) {
      MessagesStorage.storeMessage(
        user?.username,
        response_message.id,
        response_message.message,
        db
      );
      if (response_message.message.sender.username === user?.username) {
        setLastRead(response_message.id, response_message.message.id);
      }
      setResponseMessage(null);
    }
  }, [response_message]);

  return (
    <WebSocketContext.Provider value={{}}>{children}</WebSocketContext.Provider>
  );
};
