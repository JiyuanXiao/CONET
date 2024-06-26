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
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import { Alert } from "react-native";
import { ContactsContext } from "../contacts/contacts.context";

interface MessageDataProps {
  id: number;
  message: CE_MessageProps;
}

export const WebSocketContext = createContext<WebsocketContextProps>({
  websocket_connected: false,
  resetWebSocket: () => {},
  closeWebSocket: () => {},
});

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const web_socket = useRef<WebSocket | null>(null);
  const { user } = useContext(AuthenticationContext);
  const {
    chats,
    has_new_message,
    setLastRead,
    setHasNewMessageStatus,
    // setChatMap,
    updateChat,
    deleteChat,
    fetchChatDataFromServer,
  } = useContext(ChatsContext);
  const {
    messages,
    is_messages_initialized,
    receiveMessage,
    createMeesageObjectForNewChat,
    initializeMessageContext,
  } = useContext(MessagesContext);
  const { uploadContacts } = useContext(ContactsContext);
  const [websocket_connected, setWebSocketConnected] = useState(false);
  const receiveMessageRef = useRef(receiveMessage);
  const setHasNewMessageStatusRef = useRef(setHasNewMessageStatus);
  const updateChatRef = useRef(updateChat);
  const deleteChatRef = useRef(deleteChat);
  const createMeesageObjectForNewChatRef = useRef(
    createMeesageObjectForNewChat
  );
  const is_messages_initialized_Ref = useRef(is_messages_initialized);
  const user_Ref = useRef(user);
  const db = useSQLiteContext();
  const initializeMessageContextRef = useRef(initializeMessageContext);

  const handleNewMessage = async (message_data: MessageDataProps) => {
    console.log(`[WebSocket] action: new_message for chat ${message_data.id}`);

    if (
      !MessagesStorage.messageTableExist(user?.username, message_data.id, db)
    ) {
      MessagesStorage.createMessageTableIfNotExists(
        user?.username,
        message_data.id,
        db
      );
    }
    const stored_message = await MessagesStorage.storeMessage(
      user?.username,
      message_data.id,
      message_data.message,
      db
    );

    if (stored_message) {
      const recevie_success = receiveMessageRef.current(
        message_data.id,
        stored_message,
        message_data.message.custom_json
      );

      // update last read
      if (message_data.message.sender.username === user?.username) {
        setLastRead(Number(message_data.id), Number(message_data.message.id));
      } else {
        setHasNewMessageStatusRef.current(Number(message_data.id), true);
      }
    } else {
      console.warn(`[WebSocket] Unable to store message to local storage`);
    }
    console.log(
      `[WebSocket] finished new_message action: send by ${message_data.message.sender}`
    );
  };

  const handleChatsUpdate = async (chat_data: CE_ChatProps) => {
    // update chat context
    await updateChatRef.current(chat_data);

    console.log(
      `[WebSocket] finished handling action for chat ${chat_data.id}`
    );
  };

  const handleNewChat = async (chat_data: CE_ChatProps) => {
    // update chat context
    await updateChatRef.current(chat_data);

    // create message contact and table for new chat
    await createMeesageObjectForNewChatRef.current(chat_data.id);

    console.log(
      `[WebSocket] finished handling action for chat ${chat_data.id}`
    );
  };

  const handleDeleteChat = async (chat_data: CE_ChatProps) => {
    await deleteChatRef.current(chat_data.id);
    MessagesStorage.deleteMessageTableIfExists(
      user?.username,
      chat_data.id,
      db
    );
    console.log(`[WebSocket] finished deleting chat ${chat_data.id}`);
  };

  const connectWebSocket = () => {
    web_socket.current = new WebSocket(
      `${process.env.EXPO_PUBLIC_WEBSOCKET_BASE_URL}/person/?publicKey=${process.env.EXPO_PUBLIC_PROJECT_ID}&username=${user?.username}&secret=${user?.secret}`
    );

    web_socket.current.onopen = () => {
      console.log(`[WebSocket] connection opened for ${user?.username}`);
      setWebSocketConnected(true);
    };

    web_socket.current.onmessage = (event) => {
      const response = JSON.parse(event.data);

      switch (response.action) {
        case "new_message":
          console.log(`[WebSocket] ACTION: new_message`);
          const response_data: MessageDataProps = response.data;
          handleNewMessage(response_data);
          break;
        case "edit_chat":
          console.log(`[WebSocket] ACTION: edit_chat`);
          handleChatsUpdate(response.data);
          break;
        case "new_chat":
          console.log(`[WebSocket] ACTION: new_chat`);
          handleNewChat(response.data);
          break;
        case "add_person":
          console.log(`[WebSocket] ACTION: add_person`);
          handleChatsUpdate(response.data);
          break;
        case "remove_person":
          console.log(`[WebSocket] ACTION: remove_person`);
          handleChatsUpdate(response.data);
          break;
        case "delete_chat":
          console.log(`[WebSocket] ACTION: delete_chat`);
          handleDeleteChat(response.data);
          break;
        default:
          console.log(`Unknow action: ${response.action}`);
      }
    };

    web_socket.current.onclose = () => {
      console.log("[WebSocket] connection closed");
      setWebSocketConnected(false);
      // Reconnect after a delay
      if (user_Ref.current && is_messages_initialized_Ref.current) {
        console.log(
          `[WebSocket-onclose] User: ${user_Ref.current ? "true" : "false"}`
        );
        console.log(
          `[WebSocket-onclose] message initialize: ${is_messages_initialized_Ref.current}`
        );
        setTimeout(connectWebSocket, 1000);
      }
    };

    web_socket.current.onerror = (error) => {
      console.error("[WebSocket] error", error);
      setWebSocketConnected(false);
    };
  };

  const closeWebSocket = () => {
    if (web_socket.current) {
      web_socket.current.close();
      web_socket.current = null;
    }
    console.log(
      `[WebSocket] clean up connection and data for ${user?.username}`
    );
  };

  const resetWebSocket = () => {
    if (web_socket.current) {
      web_socket.current.close();
      web_socket.current = null;
      console.log(
        `[WebSocket] clean up connection and data for ${user?.username}`
      );
    } else {
      connectWebSocket();
    }
  };

  const loadNewData = async () => {
    if (user) {
      console.log(`[WebSocket] start to load new Data from server`);
      await fetchChatDataFromServer(user);
      await initializeMessageContextRef.current();
      await uploadContacts();
    }
  };

  useEffect(() => {
    return () => {
      web_socket.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!websocket_connected && user && is_messages_initialized) {
      connectWebSocket();
    }
  }, [user, is_messages_initialized]);

  useEffect(() => {
    setHasNewMessageStatusRef.current = setHasNewMessageStatus;
  }, [has_new_message]);

  useEffect(() => {
    updateChatRef.current = updateChat;
    deleteChatRef.current = deleteChat;
    initializeMessageContextRef.current = initializeMessageContext;
  }, [chats]);

  useEffect(() => {
    receiveMessageRef.current = receiveMessage;
    createMeesageObjectForNewChatRef.current = createMeesageObjectForNewChat;
  }, [messages]);

  useEffect(() => {
    user_Ref.current = user;
    console.log(`[WebSocket] User: ${user ? "true" : "false"}`);
  }, [user]);

  useEffect(() => {
    console.log(`[WebSocket] websocket connected: ${websocket_connected}`);
    if (websocket_connected && user) {
      loadNewData();
    }
  }, [websocket_connected]);

  useEffect(() => {
    is_messages_initialized_Ref.current = is_messages_initialized;
    console.log(`[WebSocket] message initialize: ${is_messages_initialized}`);
  }, [is_messages_initialized]);

  return (
    <WebSocketContext.Provider
      value={{
        websocket_connected,
        resetWebSocket,
        closeWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
