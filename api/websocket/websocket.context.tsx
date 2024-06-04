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
import * as ChatStorage from "@/api/chats/chats.storage";
import { useSQLiteContext } from "expo-sqlite";
import { ChatsContext } from "../chats/chats.context";
import { WebsocketContextProps } from "@/constants/ContextTypes";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";

interface MessageDataProps {
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
  const {
    chats,
    has_new_message,
    setLastRead,
    setHasNewMessageStatus,
    setChatMap,
  } = useContext(ChatsContext);
  const { messages, is_messages_initialized, receiveMessage } =
    useContext(MessagesContext);
  const [websocket_connected, setWebSocketConnected] = useState(false);
  const receiveMessageRef = useRef(receiveMessage);
  const setHasNewMessageStatusRef = useRef(setHasNewMessageStatus);
  const setChatMapRef = useRef(setChatMap);
  const isLoggedIn = useRef(true);
  const db = useSQLiteContext();

  const handleNewMessage = async (message_data: MessageDataProps) => {
    console.log(`[WebSocket] action: new_message for chat ${message_data.id}`);
    // update message context
    const recevie_success = receiveMessageRef.current(
      message_data.id,
      message_data.message
    );

    if (recevie_success) {
      // update message storage

      MessagesStorage.storeMessage(
        user?.username,
        message_data.id,
        message_data.message,
        db
      );

      // update last read
      if (message_data.message.sender.username === user?.username) {
        setLastRead(Number(message_data.id), Number(message_data.message.id));
      } else {
        setHasNewMessageStatusRef.current(Number(message_data.id), true);
      }
    }
    console.log(
      `[WebSocket] finished new_message action: send by ${message_data.message.sender}`
    );
  };

  const handleEditChat = async (chat_data: CE_ChatProps) => {
    console.log(`[WebSocket] action: edit_chat for chat ${chat_data.id}`);
    // update chat context
    setChatMapRef.current(chat_data.id, chat_data);

    // update chat storage
    ChatStorage.setChat(user?.username, chat_data.id, chat_data);

    console.log(
      `[WebSocket] finished edit_chat action for chat ${chat_data.id}`
    );
  };

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
        const response = JSON.parse(event.data);

        switch (response.action) {
          case "new_message":
            handleNewMessage(response.data);
            break;
          case "edit_chat":
            handleEditChat(response.data);
            break;
          default:
            console.log(`Unknow action: ${response.action}`);
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

  useEffect(() => {
    setChatMapRef.current = setChatMap;
  }, [chats]);

  useEffect(() => {
    receiveMessageRef.current = receiveMessage;
  }, [messages]);

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
