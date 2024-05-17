import React, { createContext, useState, useEffect } from "react";
import { ChatsContextProps, ChatProps } from "@/constants/Types";
import { useSQLiteContext } from "expo-sqlite";
import { fetchAllChats } from "./chats.storage";
import { fetchLatestMessage } from "../messages/messages.storage";
import { deleteChat, deleteAllChats, addNewChat } from "./chats.storage";

export const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  setChats: () => {},
  getChatById: (id: string) => undefined,
  updateChatById: (id: string, updatedChat: ChatProps) => {},
  deleteChatById: (id: string) => {},
  addChat: (
    id: string,
    name: string,
    avatar_icon: string,
    icon_color: string,
    icon_background_color: string,
    icon_border_color: string
  ) => {},
});

// Chats context provides chat info such as last message and last message timestamp
// Chat info is used for chatbox rendering
export const ChatsContextProvider = (props: { children: React.ReactNode }) => {
  const db = useSQLiteContext();
  const [chats, setChats] = useState<ChatProps[]>([]);

  useEffect(() => {
    // deleteAllChats(db);
    // for (const friend of FRIENDS) {
    //   addNewChat(
    //     friend.id,
    //     friend.name,
    //     friend.avatar_icon,
    //     friend.icon_color,
    //     friend.icon_background_color,
    //     friend.icon_border_color,
    //     db
    //   );
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
        avatar_icon: chat.avatar_icon,
        icon_color: chat.icon_color,
        icon_background_color: chat.icon_background_color,
        icon_border_color: chat.icon_border_color,
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

  const addChat = (
    id: string,
    name: string,
    avatar_icon: string,
    icon_color: string,
    icon_background_color: string,
    icon_border_color: string
  ) => {
    // add chat to local storage
    addNewChat(
      id,
      name,
      avatar_icon,
      icon_color,
      icon_background_color,
      icon_border_color,
      db
    );

    const new_chat = {
      id: id,
      name: name,
      avatar_icon: avatar_icon,
      icon_color: icon_color,
      icon_background_color: icon_background_color,
      icon_border_color: icon_border_color,
      last_message_content: "",
      last_message_timestamp: "",
    };

    setChats([...chats, new_chat]);
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
        addChat,
      }}
    >
      {props.children}
    </ChatsContext.Provider>
  );
};
