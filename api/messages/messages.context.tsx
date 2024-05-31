import React, { createContext, useState, useEffect, useContext } from "react";
import * as ChatStorage from "../chats/chats.storage";
import * as MessagesStorage from "./messages.storage";
import * as ChatServer from "../chats/chats.api";
import { useSQLiteContext, SQLiteDatabase } from "expo-sqlite";
import { MessageContextObjectProps } from "@/constants/Types";
import { AuthenticationContext } from "../authentication/authentication.context";
import { ChatsContext } from "../chats/chats.context";
import {
  CE_MessageProps,
  CE_UserProps,
} from "@/constants/ChatEngineObjectTypes";

export const MessagesContext = createContext({
  messages_object_list: [] as MessageContextObjectProps[],
  getLoadedMessagesObjectById: (chat_id: number) =>
    undefined as MessageContextObjectProps | undefined,
  loadMessagesById: (chat_id: number) => {},
  sendMessage: (
    chat_id: number,
    username: string,
    text_content: string | null,
    file_url: string | null,
    timestamp: string
  ) => {},
  conformMessageIsSent: (
    username: string,
    chat_id: number,
    ce_message: CE_MessageProps
  ) => {},
  resetLoadedMessagesById: (chat_id: number) => {},
  ClearAllMessagesById: (chat_id: number) => {},
});

// DESCRIPTION: getLoadedMessages() is a helper function that load specific amount messages from local
//              storage to the message context object so that message can be rendered to the friend
//              window via message context
// PARAMETERS:
//              friend_id: ID of the friend which need to render more message
//              messages_object: the messages context object which need to be updated
//              num_of_msg_load: number of messages that need to render
//              db: the database object of the local storage
// RETURN:
//              return a new message context object in which the required messages have been loaded
const getLoadedMessages = async (
  username: string,
  chat_id: number,
  messages_object: MessageContextObjectProps,
  num_of_msg_load: number,
  db: SQLiteDatabase,
  is_initial_load: boolean
) => {
  // Load messages if not all messages have been loaded
  // If this is initial load, the index and messages amount indicators is inaccurate, so perfrom the load anyway
  if (
    is_initial_load ||
    messages_object.current_index < messages_object.total_messages_amount
  ) {
    const start_index = messages_object.current_index;

    console.info(
      "getLoadedMessages() at messages.context.tsx is calling: fetchAllMessages()"
    );
    const all_messages = await MessagesStorage.fetchAllMessages(
      username,
      chat_id,
      db
    );

    const msg_list_len = all_messages.length;

    if (
      messages_object.total_messages_amount > 0 &&
      messages_object.total_messages_amount !== msg_list_len
    ) {
      console.warn(
        "LOAD_MESSAGES: Message Context messages amount does not match with Local Storage message list length"
      );
    }

    const end_index = Math.min(msg_list_len, start_index + num_of_msg_load);

    const loaded_messages = all_messages.slice(start_index, end_index);

    const new_messages_object: MessageContextObjectProps = {
      chat_id: messages_object.chat_id,
      loaded_messages: [...messages_object.loaded_messages, ...loaded_messages],
      current_index: end_index,
      total_messages_amount: msg_list_len,
    };

    return new_messages_object;
  } else {
    return messages_object;
  }
};

export const MessagesContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const NUM_OF_LITEMS_TO_LOAD_AT_ONCE = 15;

  const db = useSQLiteContext();
  const { user } = useContext(AuthenticationContext);
  const { chats, is_chats_initialized } = useContext(ChatsContext);

  const [messages_object_list, setMessagesObjectList] = useState<
    MessageContextObjectProps[]
  >([]);

  // Get loaded message object for a friend
  const getLoadedMessagesObjectById = (chat_id: number) => {
    const target_messages_object = messages_object_list.find(
      (messages_object) =>
        messages_object.chat_id.toString() === chat_id.toString()
    );
    return target_messages_object;
  };

  // Take the "load" action for a friend's chat
  const loadMessagesById = async (chat_id: number) => {
    // find the index of original message object
    const target_object_index = messages_object_list.findIndex(
      (messages_object) =>
        messages_object.chat_id.toString() === chat_id.toString()
    );

    if (target_object_index !== -1) {
      const target_messages_object = messages_object_list[target_object_index];
      //Load messages
      const is_initial_load = false;
      console.info(
        "loadMessagesById() at messages.context.tsx is calling: getLoadedMessages()"
      );
      const newly_loaded_messages_object = await getLoadedMessages(
        user?.username || "",
        chat_id,
        target_messages_object,
        NUM_OF_LITEMS_TO_LOAD_AT_ONCE,
        db,
        is_initial_load
      );

      // Replace the target message object by the loaded one
      const updated_messages_object_list = [...messages_object_list];
      updated_messages_object_list[target_object_index] =
        newly_loaded_messages_object;
      setMessagesObjectList(updated_messages_object_list);
    } else {
      console.warn(
        `at getLoadedMessagesObjectById() in messages.context.tsx: chat_id:${chat_id} DOES NOT EXIST`
      );
    }
  };

  const sendMessage = (
    chat_id: number,
    username: string,
    text_content: string | null,
    file_url: string | null,
    timestamp: string
  ) => {
    const new_message = {
      message_id: -1,
      sender_username: username,
      text_content: text_content || "",
      file_url: file_url || "",
      content_type: text_content ? "text" : "file",
      timestamp: timestamp,
    };

    const target_object_index = messages_object_list.findIndex(
      (messages_object) =>
        messages_object.chat_id.toString() === chat_id.toString()
    );

    if (target_object_index !== -1) {
      const target_messages_object = messages_object_list[target_object_index];

      // Construct the message object by appending the new message
      const updated_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: [
          new_message,
          ...target_messages_object.loaded_messages,
        ],
        current_index: target_messages_object.current_index + 1,
        total_messages_amount: target_messages_object.total_messages_amount + 1,
      };

      // Replace the target message object by the loaded one
      const updated_messages_object_list = [...messages_object_list];
      updated_messages_object_list[target_object_index] =
        updated_messages_object;
      setMessagesObjectList(updated_messages_object_list);
    } else {
      console.warn(
        `at addMessageById() in messages.context.tsx: chat_id ${chat_id} DOES NOT EXIST`
      );
    }
  };

  // Add a newly sent or recevied message to local storage and context
  const conformMessageIsSent = (
    username: string,
    chat_id: number,
    ce_message: CE_MessageProps
  ) => {
    // store new message to local storage
    console.info(
      "addMessageById() at messages.context.tsx is calling: storeMessage()"
    );
    const new_message = MessagesStorage.storeMessage(
      username,
      chat_id,
      ce_message,
      db
    );

    if (new_message) {
      // find the index of original message object
      const target_object_index = messages_object_list.findIndex(
        (messages_object) =>
          messages_object.chat_id.toString() === chat_id.toString()
      );

      if (target_object_index !== -1) {
        const target_messages_object =
          messages_object_list[target_object_index];

        const target_message_index =
          target_messages_object.loaded_messages.findIndex((message) => {
            message.timestamp === ce_message.custom_json;
          });

        target_messages_object.loaded_messages[target_message_index] =
          new_message;

        // Replace the target message object by the loaded one
        const updated_messages_object_list = [...messages_object_list];
        updated_messages_object_list[target_object_index] =
          target_messages_object;
        setMessagesObjectList(updated_messages_object_list);
      } else {
        console.warn(
          `at addMessageById() in messages.context.tsx: chat_id ${chat_id} DOES NOT EXIST`
        );
      }
    }
  };

  // Use for switching back from chat screen to chat list screen
  const resetLoadedMessagesById = async (chat_id: number) => {
    // find the index original message object
    const target_object_index = messages_object_list.findIndex(
      (messages_object) =>
        messages_object.chat_id.toString() === chat_id.toString()
    );

    if (target_object_index !== -1) {
      const target_messages_object = messages_object_list[target_object_index];

      const end_index = Math.min(
        target_messages_object.total_messages_amount,
        NUM_OF_LITEMS_TO_LOAD_AT_ONCE
      );

      // Construct the messages object in which the number of loaded messages is the default value
      const updated_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: target_messages_object.loaded_messages.slice(
          0,
          end_index
        ),
        current_index: end_index,
        total_messages_amount: target_messages_object.total_messages_amount,
      };

      // Replace the target message object by the loaded one
      const updated_messages_object_list = [...messages_object_list];
      updated_messages_object_list[target_object_index] =
        updated_messages_object;
      setMessagesObjectList(updated_messages_object_list);
    } else {
      try {
        console.info(
          `Message ojbect with chat_id: ${chat_id} does not xxist in message context`
        );
        console.info(
          `Creating a new message object with chat_id: ${chat_id}...`
        );
        const initial_messages_object = {
          chat_id: chat_id,
          loaded_messages: [],
          current_index: 0,
          total_messages_amount: 0,
        };

        // First load
        const is_initial_load = true;
        console.info(
          "resetLoadedMessagesById() at messages.context.tsx is calling: getLoadedMessages()"
        );
        const newly_loaded_messages_object = await getLoadedMessages(
          user?.username || "",
          chat_id,
          initial_messages_object,
          NUM_OF_LITEMS_TO_LOAD_AT_ONCE,
          db,
          is_initial_load
        );

        // Append new messages object to object list
        setMessagesObjectList([
          ...messages_object_list,
          newly_loaded_messages_object,
        ]);
        console.info(
          `New message object with chat_id: ${chat_id} is created successfully...`
        );
      } catch (err) {
        console.error(
          "at resetLoadedMessagesById() in messages.context.tsx: " + err
        );
      }
    }
  };

  const ClearAllMessagesById = async (chat_id: number) => {
    console.log("Start to clear all messages data for " + chat_id);
    MessagesStorage.deleteMessageTableIfExists(
      user?.username || "",
      chat_id,
      db
    );
    MessagesStorage.createMessageTableIfNotExists(
      user?.username || "",
      chat_id,
      db
    );

    // find the index of original message object
    const target_object_index = messages_object_list.findIndex(
      (messages_object) =>
        messages_object.chat_id.toString() === chat_id.toString()
    );

    if (target_object_index !== -1) {
      // construct a mock messages oject with a empty message list
      let cleared_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: [],
        current_index: 0,
        total_messages_amount: 0,
      };

      // update the actual message object statu by loading messages from the local storage
      const is_initial_load = true;
      console.info(
        "ClearAllMessagesById() at messages.context.tsx is calling: getLoadedMessages()"
      );
      cleared_messages_object = await getLoadedMessages(
        user?.username || "",
        chat_id,
        cleared_messages_object,
        NUM_OF_LITEMS_TO_LOAD_AT_ONCE,
        db,
        is_initial_load
      );

      // Replace the target message object by the loaded one
      const updated_messages_object_list = [...messages_object_list];
      updated_messages_object_list[target_object_index] =
        cleared_messages_object;
      setMessagesObjectList(updated_messages_object_list);
    } else {
      console.warn(
        `at ClearAllMessagesById() in messages.context.tsx: chat_id ${chat_id} DOES NOT EXIST`
      );
    }
  };

  const initialSetUpObjectList = async () => {
    if (user) {
      console.info("Start to initialize message context...");

      const chat_server_connected = true;

      if (chat_server_connected) {
        console.log(
          "Start to get messages data from server and update to storage for " +
            user.username
        );
        for (const chat of chats) {
          const last_read = await ChatStorage.getLastRead(
            user.username,
            chat.id
          );
          const ce_message_object_list = ChatServer.GetUnreadChatMessages(
            user.username,
            user.secret,
            chat.id,
            last_read
          );
          if (!MessagesStorage.messageTableExist(user.username, chat.id, db)) {
            MessagesStorage.createMessageTableIfNotExists(
              user.username,
              chat.id,
              db
            );
          }
          for (const ce_message_object of ce_message_object_list) {
            if (ce_message_object.id > last_read) {
              console.log(ce_message_object.text);
              MessagesStorage.storeMessage(
                user.username,
                chat.id,
                ce_message_object,
                db
              );
            }
          }
        }
        console.log("Finish updating messages storage data from server...");
      }

      console.log(
        "Start to fetch messages data from local storage to context..."
      );

      let initialMessagesObjectList: MessageContextObjectProps[] = [];

      // Fetach all messages from loacl storage for each friend
      for (const chat of chats) {
        console.log("Update last read for chat " + chat.id);
        const current_chat_last_read = chat.last_message.id;
        ChatStorage.setLastRead(user.username, chat.id, current_chat_last_read);

        let initial_messages_object = {
          chat_id: chat.id,
          loaded_messages: [],
          current_index: 0,
          total_messages_amount: 0,
        } as MessageContextObjectProps;

        // If message data existed already, load the data
        if (MessagesStorage.messageTableExist(user.username, chat.id, db)) {
          const is_initial_load = true;
          console.info(
            "initialSetUpObjectList() at messages.context.tsx is calling: getLoadedMessages() for " +
              chat.id
          );
          initial_messages_object = await getLoadedMessages(
            user.username,
            chat.id,
            initial_messages_object,
            NUM_OF_LITEMS_TO_LOAD_AT_ONCE,
            db,
            is_initial_load
          );
        }
        // If message data doesn't exist, create one in local storage
        else {
          console.info(
            "initialSetUpObjectList() at messages.context.tsx is calling: createMessageTableIfNotExists()"
          );
          MessagesStorage.createMessageTableIfNotExists(
            user.username,
            chat.id,
            db
          );
        }

        // Append new messages object to object list
        initialMessagesObjectList = [
          ...initialMessagesObjectList,
          initial_messages_object,
        ];
      }

      setMessagesObjectList(initialMessagesObjectList);
      console.log(
        "Finish fetching messages data from local storage to context..."
      );

      console.info("Initialize message context successfully...");
    }
  };

  useEffect(() => {
    if (is_chats_initialized) {
      initialSetUpObjectList();
    }
  }, [is_chats_initialized]);

  return (
    <MessagesContext.Provider
      value={{
        messages_object_list,
        getLoadedMessagesObjectById,
        loadMessagesById,
        sendMessage,
        conformMessageIsSent,
        resetLoadedMessagesById,
        ClearAllMessagesById,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};
