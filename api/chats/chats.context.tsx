import React, { createContext, useState, useEffect, useContext } from "react";
import { ChatsContextProps } from "@/constants/ContextTypes";
import * as ChatStorage from "./chats.storage";
import * as ChatServer from "./chats.api";
import { AuthenticationContext } from "../authentication/authentication.context";
import { CE_ChatProps, CE_UserProps } from "@/constants/ChatEngineObjectTypes";

export const ChatsContext = createContext<ChatsContextProps>({
  chats: new Map<number, CE_ChatProps>(),
  setChatMap: () => {},
  current_talking_chat_id: -1,
  setCurrentTalkingChatId: () => {},
  has_new_message: new Map<number, boolean>(),
  setHasNewMessageStatus: () => {},
  is_chats_initialized: false,
  is_chats_loaded_from_local: false,
  // addChat: async () => {},
  updateChat: async () => {},
  deleteChat: async () => {},
  getLastRead: async () => 0,
  setLastRead: async () => {},
  fetchChatDataFromServer: async () => {},
  resetChatContext: () => {},
});

// Friends context provides friend log such as last message and last message timestamp
// Friend log is used for chatbox rendering
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
  const [is_chats_loaded_from_local, setIsChatsLoadedFromLocal] =
    useState<boolean>(false);
  const [is_chats_initialized, setIsChatsInitialized] =
    useState<boolean>(false);
  const [has_new_message, setHasNewMessage] = useState<Map<number, boolean>>(
    new Map<number, boolean>()
  );

  const setChatMap = (chat_id: number, chat: CE_ChatProps) => {
    setChats(new Map(chats.set(Number(chat_id), chat)));
  };

  const setHasNewMessageStatus = (chat_id: number, read_status: boolean) => {
    setHasNewMessage(
      new Map(has_new_message.set(Number(chat_id), read_status))
    );
    console.log(
      `[Chat Context] set chat ${chat_id} has new message status to ${read_status}`
    );
  };

  const updateChat = async (chat_object: CE_ChatProps) => {
    try {
      // update each person's avatar
      // for (const person of chat_object.people) {
      //   const new_avatar_uri = await ChatStorage.saveAvatarToFilesystem(
      //     user?.username,
      //     chat_object.id,
      //     person.person.username,
      //     person.person.custom_json
      //   );
      //   if (new_avatar_uri) {
      //     person.person.avatar = new_avatar_uri;
      //   }
      // }
      // update chat to local storage
      await ChatStorage.setChat(user?.username, chat_object.id, chat_object);

      // update chat context
      console.log(
        `[Chat Context] Start to update chat ${chat_object.id}'s context data..."`
      );
      setChatMap(chat_object.id, chat_object);
      console.log(
        `[Chat Context] Chat ${chat_object.title}'s context data is updated successfully...`
      );
    } catch (err) {
      console.error(`[Chat Context] updateChat(): ${err}`);
    }
  };

  const deleteChat = async (chat_id: number) => {
    try {
      console.log(
        `[Chat Context] Start to delete chat ${chat_id}'s context and storage data...`
      );
      // delete chat from local storage
      await ChatStorage.deleteAllChatImagesFromFilesystem(
        user?.username,
        chat_id
      );
      await ChatStorage.removeChat(user?.username, chat_id);
      console.log(`[Chat Context] delete storage data for chat: ${chat_id}`);

      // update context
      const new_chats = new Map(chats);
      if (new_chats.delete(chat_id)) {
        setChats(new Map<number, CE_ChatProps>(new_chats));
        console.log(`[Chat Context] delete context data for chat: ${chat_id}`);
      }

      // delete chat's last read data
      await ChatStorage.deleteLastRead(user?.username, chat_id);
      console.log(
        `[Chat Context] delete storage last read data for chat: ${chat_id}`
      );

      const new_list = new Map(has_new_message);
      if (new_list.delete(chat_id)) {
        setHasNewMessage(new_list);
        console.log(
          `[Chat Context] delete context last read data for chat: ${chat_id}`
        );
      }
    } catch (err) {
      console.error(`[Chat Context] deleteChat(): ${err}`);
    }
  };

  const getLastRead = async (chat_id: number) => {
    try {
      const last_read = await ChatStorage.getLastRead(user?.username, chat_id);
      console.log(`[Chat Context] get last read for chat ${chat_id}`);
      return last_read;
    } catch (err) {
      console.error(`[Chat Context] getLastRead(): ${err}`);
      return -1;
    }
  };

  const setLastRead = async (chat_id: number, last_read_message_id: number) => {
    try {
      await ChatStorage.setLastRead(
        user?.username,
        chat_id,
        last_read_message_id
      );
      setHasNewMessageStatus(chat_id, false);
      console.log(
        `[Chat Context] set last read as ${last_read_message_id} for chat ${chat_id}`
      );
    } catch (err) {
      console.error(`[Chat Context] setLastRead(): ${err}`);
    }
  };

  const fetchChatDataFromStorage = async (user: CE_UserProps) => {
    setIsChatsLoadedFromLocal(false);
    console.log(
      "[Chat Context] Start to fetch chats' data from local storage..."
    );
    const all_chats = await ChatStorage.fetchAllChats(user.username);

    console.log("[Chat Context] Start to update loacl chat data to context");
    for (const chat of all_chats) {
      setChatMap(chat.id, chat);

      const last_read = await ChatStorage.getLastRead(user.username, chat.id);
      setHasNewMessageStatus(chat.id, chat.last_message.id > last_read);
    }
    setIsChatsLoadedFromLocal(true);
    console.log("[Chat Context] Chat data has been loaded from local storage");
  };

  const fetchChatDataFromServer = async (user: CE_UserProps) => {
    console.log("[Chat Context] Start to fetch chats' data from server...");
    const new_chats = await ChatServer.GetMyChats(user.username, user.secret);

    console.log(
      "[Chat Context] Start to update new chat data to local storage and context..."
    );

    const init_chats = new Map<number, CE_ChatProps>();
    const init_has_new_message = new Map<number, boolean>();
    for (const chat of new_chats) {
      // for (const person of chat.people) {
      //   const new_avatar_uri = await ChatStorage.saveAvatarToFilesystem(
      //     user.username,
      //     chat.id,
      //     person.person.username,
      //     person.person.custom_json
      //   );
      //   if (new_avatar_uri) {
      //     person.person.avatar = new_avatar_uri;
      //   }
      // }

      init_chats.set(chat.id, chat);

      const last_read = await ChatStorage.getLastRead(user.username, chat.id);
      init_has_new_message.set(chat.id, chat.last_message.id > last_read);

      console.log(
        `[Chat Context] chat ${chat.id}: New message: ${chat.last_message.id} -> Last read: ${last_read}`
      );
      console.log(
        `[Chat Context] chat ${chat.id} has new message: ${has_new_message.get(
          chat.id
        )}`
      );

      ChatStorage.setChat(user.username, chat.id, chat);
    }

    setChats(init_chats);
    setHasNewMessage(init_has_new_message);

    console.log("[Chat Context] Chat data has been loaded from server");
  };

  const initializeChatsContext = async () => {
    if (user) {
      setIsChatsInitialized(false);
      console.log("[Chat Context] Start to initialize chat context...");

      await fetchChatDataFromStorage(user);

      await fetchChatDataFromServer(user);

      console.log("[Chat Context] Initialize chat context successfully...");

      setIsChatsInitialized(true);
    }
  };

  const resetChatContext = () => {
    setChats(new Map<number, CE_ChatProps>());
    setCurrentTalkingChatId(-1);
    setIsChatsInitialized(false);
    setHasNewMessage(new Map<number, boolean>());
    console.log(`[Chat Context] all chat context data has been cleaned`);
  };

  useEffect(() => {
    if (is_authentication_initialized) {
      initializeChatsContext();
    }
  }, [is_authentication_initialized]);

  useEffect(() => {
    console.log(
      `[Chat Context] current talking chat: ${current_talking_chat_id}`
    );
  }, [current_talking_chat_id]);

  return (
    <ChatsContext.Provider
      value={{
        chats,
        setChatMap,
        current_talking_chat_id,
        setCurrentTalkingChatId,
        has_new_message,
        setHasNewMessageStatus,
        is_chats_initialized,
        is_chats_loaded_from_local,
        updateChat,
        deleteChat,
        getLastRead,
        setLastRead,
        fetchChatDataFromServer,
        resetChatContext,
      }}
    >
      {props.children}
    </ChatsContext.Provider>
  );
};
