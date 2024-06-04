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
import { WebsocketContextProps } from "@/constants/ContextTypes";

interface MessageResponseProps {
  id: number;
  message: CE_MessageProps;
}

export const WebSocketContext = createContext<WebsocketContextProps>({
  websocket_connected: false,
  resetWebSocket: () => {},
});

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthenticationContext);
  const { has_new_message, setLastRead, setHasNewMessageStatus } =
    useContext(ChatsContext);
  const { is_messages_initialized, receiveMessage } =
    useContext(MessagesContext);
  const [websocket_connected, setWebSocketConnected] = useState(false);
  const setHasNewMessageStatusRef = useRef(setHasNewMessageStatus);
  const isLoggedIn = useRef(true);
  const db = useSQLiteContext();

  const connectWebSocket = () => {
    if (user && is_messages_initialized && isLoggedIn.current) {
      ws.current = new WebSocket(
        `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/person/?publicKey=${process.env.EXPO_PUBLIC_PROJECT_ID}&username=${user?.username}&secret=${user?.secret}`
      );

      ws.current.onopen = () => {
        console.log(`[WebSocket] connection opened for ${user?.username}`);
        setWebSocketConnected(true);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.action === "new_message") {
          // update message context
          const recevie_success = receiveMessage(
            message.data.id,
            message.data.message
          );

          if (recevie_success) {
            // update message storage
            const response_message = message.data;
            MessagesStorage.storeMessage(
              user?.username,
              response_message.id,
              response_message.message,
              db
            );

            // update last read
            if (response_message.message.sender.username === user?.username) {
              setLastRead(
                Number(response_message.id),
                Number(response_message.message.id)
              );
            } else {
              setHasNewMessageStatusRef.current(
                Number(response_message.id),
                true
              );
            }
          }
          console.log(JSON.stringify(message.data, null, 2));
        }
      };

      ws.current.onclose = () => {
        console.log("[WebSocket] connection closed");
        setWebSocketConnected(false);
        // Reconnect after a delay
        if (user && is_messages_initialized && isLoggedIn.current) {
          setTimeout(connectWebSocket, 1000);
        }
      };

      ws.current.onerror = (error) => {
        console.error("[WebSocket] error", error);
        setWebSocketConnected(false);
      };
    }
  };

  useEffect(() => {
    if (!websocket_connected) {
      connectWebSocket();
    }
    return () => {
      ws.current?.close();
    };
  }, [user, is_messages_initialized, isLoggedIn]);

  useEffect(() => {
    if (user && is_messages_initialized) {
      isLoggedIn.current = true;
    }
  }, [user, is_messages_initialized]);

  useEffect(() => {
    setHasNewMessageStatusRef.current = setHasNewMessageStatus;
  }, [has_new_message]);

  const resetWebSocket = () => {
    isLoggedIn.current = false;
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    console.log(`[WebSocket] clean up connection and data`);
  };

  return (
    <WebSocketContext.Provider value={{ websocket_connected, resetWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};
