import React, { createContext, useState } from "react";
import { ChatsContextProps, ChatProps } from "@/constants/Types";
import { useSQLiteContext } from "expo-sqlite";
import { getAllChats } from "./chats.storage";
import { fetchLatestMessage } from "../messages/messages.storage";

export const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  setChats: () => {},
  getChatById: (id: string) => undefined,
  updateChatById: (id: string, updatedChat: ChatProps) => {},
});

// Chats context provides chat info such as last message and last message timestamp
// Chat info is used for chatbox rendering
export const ChatsContextProvider = (props: { children: React.ReactNode }) => {
  const db = useSQLiteContext();
  const init_chats = [];

  // Get all chats' id from local storage
  const chat_id_list = getAllChats(db);

  // Collect all chat's last message and its timestamp from local storage
  for (const chat_id of chat_id_list) {
    const current_msg = fetchLatestMessage(chat_id, db);
    const current_chat = {
      id: chat_id,
      last_message_content: current_msg?.content || "",
      last_message_timestamp: current_msg?.timestamp || "",
    };
    init_chats.push(current_chat);
  }

  // Initialize chats
  const [chats, setChats] = useState<ChatProps[]>(init_chats);

  const getChatById = (id: string) => {
    return chats.find((chat) => chat.id === id);
  };

  const updateChatById = (id: string, updatedChat: ChatProps) => {
    const targetChatIndex = chats.findIndex((chat) => chat.id === id);

    if (targetChatIndex !== -1) {
      const updatedChats = [...chats];
      updatedChats[targetChatIndex] = updatedChat;
      setChats(updatedChats);
    } else {
      setChats([...chats, updatedChat]);
    }
  };

  return (
    <ChatsContext.Provider
      value={{ chats, setChats, getChatById, updateChatById }}
    >
      {props.children}
    </ChatsContext.Provider>
  );
};
