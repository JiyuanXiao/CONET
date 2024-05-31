import React, { createContext, useState, useEffect, useContext } from "react";
import { ChatsContextProps, ChatProps, UserProps } from "@/constants/Types";
import * as ChatStorage from "./chats.storage";
import * as ChatServer from "./chats.api";
import { AuthenticationContext } from "../authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";

export const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  setChats: () => {},
  current_talking_chat_id: -1,
  setCurrentTalkingChatId: () => {},
  is_chats_initialized: false,
  addChat: (chat_object: CE_ChatProps) => {},
  updateChat: (chat_object: CE_ChatProps) => {},
  deleteChat: (chat_id: number) => {},
});

// Friends context provides friend info such as last message and last message timestamp
// Friend info is used for chatbox rendering
export const ChatsContextProvider = (props: { children: React.ReactNode }) => {
  const { user, is_authentication_initialized } = useContext(
    AuthenticationContext
  );
  const [chats, setChats] = useState<CE_ChatProps[]>([]);
  const [current_talking_chat_id, setCurrentTalkingChatId] =
    useState<number>(-1);
  const [is_chats_initialized, setIsChatsInitialized] =
    useState<boolean>(false);

  const initializeChatsContext = async () => {
    if (user) {
      console.log("Start to initialize chat context...");

      const chat_server_connected = true;
      if (chat_server_connected) {
        console.log("Start to fetch chats' data from server...");
        const new_chats = await ChatServer.GetMyChats(
          user.username,
          user.secret
        );
        setChats(new_chats);
        console.log("Update new chat data to local storage...");
        for (const chat of new_chats) {
          ChatStorage.setChat(user.username, chat.id, chat);
        }
      } else {
        console.log("Unable to conntect to server...");
        console.log("Start to fetch chats' data from local storage...");
        const all_chats = await ChatStorage.fetchAllChats(user.username);
        setChats(all_chats);
      }

      console.log("Initialize chat context successfully...");
      setIsChatsInitialized(true);
      // TODO: Get data from Chat Engine to update context and storage
    }
  };

  useEffect(() => {
    if (is_authentication_initialized) {
      initializeChatsContext();
    }
  }, [is_authentication_initialized]);

  const addChat = (new_chat: CE_ChatProps) => {
    // add chat to local storage
    ChatStorage.setChat(user?.username, new_chat.id, new_chat);

    // add chat to conext
    setChats([...chats, new_chat]);
    console.info(
      "New chat " + new_chat.title + " has been added to chat context"
    );
  };

  const updateChat = (chat_object: CE_ChatProps) => {
    // update chat to local storage
    ChatStorage.setChat(user?.username, chat_object.id, chat_object);

    // update chat context
    const targetChatIndex = chats.findIndex(
      (chat) => chat.id.toString() === chat_object.id.toString()
    );

    if (targetChatIndex !== -1) {
      console.info(
        `Start to update chat ${chat_object.title}'s context data..."`
      );

      const updatedChats = [...chats];
      updatedChats[targetChatIndex] = chat_object;
      setChats(updatedChats);
      console.info(
        `Chat ${chat_object.title}'s context data is updated successfully...`
      );
    } else {
      console.warn(
        `Chat with ID: ${chat_object.id} doesn't exist in chat context`
      );
      addChat(chat_object);
    }
  };

  const deleteChat = (chat_id: number) => {
    console.info(
      `Start to delete chat ${chat_id}'s context and storage data...`
    );
    // update local storage
    ChatStorage.removeChat(user?.username, chat_id);

    // update context
    setChats(chats.filter((chat) => chat.id !== chat_id));
    console.info(
      `Chat ${chat_id}'s context data and storage data is deleted succrssfully...`
    );
  };

  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChats,
        current_talking_chat_id,
        setCurrentTalkingChatId,
        is_chats_initialized,
        addChat,
        updateChat,
        deleteChat,
      }}
    >
      {props.children}
    </ChatsContext.Provider>
  );
};
