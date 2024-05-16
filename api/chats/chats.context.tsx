import React, { createContext, useState, useEffect } from "react";
import { ChatsContextProps, ChatProps } from "@/constants/Types";
import { useSQLiteContext } from "expo-sqlite";
import { fetchAllChats } from "./chats.storage";
import { fetchLatestMessage } from "../messages/messages.storage";
import { deleteChat, deleteAllChats, addNewChat } from "./chats.storage";

const FRIENDS = [
  {
    id: "shaoji",
    name: "烧鸡",
  },
  {
    id: "yejiang",
    name: "叶酱",
  },
  {
    id: "jichang",
    name: "鸡肠",
  },
];

export const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  setChats: () => {},
  getChatById: (id: string) => undefined,
  updateChatById: (id: string, updatedChat: ChatProps) => {},
  deleteChatById: (id: string) => {},
});

// Chats context provides chat info such as last message and last message timestamp
// Chat info is used for chatbox rendering
export const ChatsContextProvider = (props: { children: React.ReactNode }) => {
  const db = useSQLiteContext();
  const [chats, setChats] = useState<ChatProps[]>([]);

  useEffect(() => {
    // deleteAllChats(db);
    // for (const friend of FRIENDS) {
    //   addNewChat(friend.id, friend.name, db);
    // }

    const init_chats = [];
    // Get all chats' id from local storage
    const chats = fetchAllChats(db);

    // Collect all chat's last message and its timestamp from local storage
    for (const chat of chats) {
      const current_msg = fetchLatestMessage(chat.chat_id, db);
      const current_chat = {
        id: chat.chat_id,
        name: chat.friend_name,
        last_message_content: current_msg?.content || "",
        last_message_timestamp: current_msg?.timestamp || "",
      };
      init_chats.push(current_chat);
    }
    setChats(init_chats);
    console.log("Initialize Chat Context Successfully...");
  }, []);

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

  const deleteChatById = (id: string) => {
    // update local storage
    deleteChat(id, db);

    // update context
    setChats(chats.filter((chat) => chat.id !== id));
  };

  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChats,
        getChatById,
        updateChatById,
        deleteChatById,
      }}
    >
      {props.children}
    </ChatsContext.Provider>
  );
};
