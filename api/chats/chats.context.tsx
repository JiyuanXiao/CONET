import React, { createContext, useState, useEffect, useContext } from "react";
import { ChatsContextProps } from "@/constants/ContextTypes";
import * as ChatStorage from "./chats.storage";
import * as ChatServer from "./chats.api";
import { AuthenticationContext } from "../authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";

export const ChatsContext = createContext<ChatsContextProps>({
  chats: new Map<number, CE_ChatProps>(),
  setChatMap: () => {},
  current_talking_chat_id: -1,
  setCurrentTalkingChatId: () => {},
  is_chats_initialized: false,
  addChat: () => {},
  updateChat: () => {},
  deleteChat: () => {},
  has_new_message: new Map<number, boolean>(),
  setHasNewMessageStatus: () => {},
});

// Friends context provides friend info such as last message and last message timestamp
// Friend info is used for chatbox rendering
export const ChatsContextProvider = (props: { children: React.ReactNode }) => {
  const { user, is_authentication_initialized } = useContext(
    AuthenticationContext
  );
  //const [chats, setChats] = useState<CE_ChatProps[]>([]);
  const [chats, setChats] = useState<Map<number, CE_ChatProps>>(
    new Map<number, CE_ChatProps>()
  );
  const [current_talking_chat_id, setCurrentTalkingChatId] =
    useState<number>(-1);
  const [is_chats_initialized, setIsChatsInitialized] =
    useState<boolean>(false);
  const [has_new_message, setHasNewMessage] = useState<Map<number, boolean>>(
    new Map<number, boolean>()
  );

  const setChatMap = (chat_id: number, chat: CE_ChatProps) => {
    setChats(new Map(chats.set(chat_id, chat)));
  };

  const setHasNewMessageStatus = (chat_id: number, read_status: boolean) => {
    setHasNewMessage(new Map(has_new_message.set(chat_id, read_status)));
  };

  const addChat = (new_chat: CE_ChatProps) => {
    // add chat to local storage
    ChatStorage.setChat(user?.username, new_chat.id, new_chat);

    // add chat to conext
    setChatMap(new_chat.id, new_chat);
    console.info(
      "New chat " + new_chat.title + " has been added to chat context"
    );
  };

  const updateChat = (chat_object: CE_ChatProps) => {
    // update chat to local storage
    ChatStorage.setChat(user?.username, chat_object.id, chat_object);

    // update chat context
    console.info(`Start to update chat ${chat_object.id}'s context data..."`);
    setChatMap(chat_object.id, chat_object);
    console.info(
      `Chat ${chat_object.title}'s context data is updated successfully...`
    );
  };

  const deleteChat = (chat_id: number) => {
    console.info(
      `Start to delete chat ${chat_id}'s context and storage data...`
    );
    // update local storage
    ChatStorage.removeChat(user?.username, chat_id);

    // update context
    const new_chats = new Map(chats);
    if (new_chats.delete(chat_id)) {
      setChats(new_chats);
    }
    console.info(
      `Chat ${chat_id}'s context data and storage data is deleted succrssfully...`
    );
  };

  const initializeChatsContext = async () => {
    if (user) {
      console.log("Start to initialize chat context...");

      console.log("Start to fetch chats' data from local storage...");
      const all_chats = await ChatStorage.fetchAllChats(user.username);

      console.log("Start to update loacl chat data to context");
      for (const chat of all_chats) {
        setChatMap(chat.id, chat);

        const last_read = await ChatStorage.getLastRead(user.username, chat.id);
        setHasNewMessageStatus(chat.id, chat.last_message.id > last_read);
      }
      console.log("Chat data has been loaded from local storage");

      const chat_server_connected = true;
      if (chat_server_connected) {
        console.log("Start to fetch chats' data from server...");
        const new_chats = await ChatServer.GetMyChats(
          user.username,
          user.secret
        );

        console.log(
          "Start to update new chat data to local storage and context..."
        );

        for (const chat of new_chats) {
          setChatMap(chat.id, chat);

          const last_read = await ChatStorage.getLastRead(
            user.username,
            chat.id
          );

          setHasNewMessageStatus(chat.id, chat.last_message.id > last_read);
          console.log(`${chat.id}: New message: ${chat.last_message.id}`);
          console.log(`${chat.id}: Last read: ${last_read}`);
          console.log(
            `${chat.id}: has new message: ${has_new_message.get(chat.id)}`
          );

          ChatStorage.setChat(user.username, chat.id, chat);
        }

        console.log("Chat data has been loaded from server");
      } else {
        console.log("Cannot connet to chat server...");
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

  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChatMap,
        current_talking_chat_id,
        setCurrentTalkingChatId,
        is_chats_initialized,
        addChat,
        updateChat,
        deleteChat,
        has_new_message,
        setHasNewMessageStatus,
      }}
    >
      {props.children}
    </ChatsContext.Provider>
  );
};
