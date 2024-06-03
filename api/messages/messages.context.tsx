import React, { createContext, useState, useEffect, useContext } from "react";
import * as MessagesStorage from "./messages.storage";
import * as ChatServer from "@/api/chats/chats.api";
import * as MessageServer from "@/api/messages/messages.api";
import { useSQLiteContext } from "expo-sqlite";
import {
  MessageContextObjectProps,
  MessageContextProps,
  MessagesProps,
} from "@/constants/ContextTypes";
import { AuthenticationContext } from "../authentication/authentication.context";
import { ChatsContext } from "../chats/chats.context";
import { CE_MessageProps } from "@/constants/ChatEngineObjectTypes";
import { getLoadedMessages } from "./messages.context.util";

export const MessagesContext = createContext<MessageContextProps>({
  messages: new Map<number, MessageContextObjectProps>(),
  loadMessagesById: async () => {},
  sendMessage: () => {},
  receiveMessage: () => false,
  resetLoadedMessagesById: async () => {},
  ClearAllMessagesById: async () => {},
  is_messages_initialized: false,
});

export const MessagesContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const NUM_OF_MESSAGES_LOAD_AT_ONCE = 15;
  const [messages, setMessages] = useState<
    Map<number, MessageContextObjectProps>
  >(new Map<number, MessageContextObjectProps>());
  const [is_messages_initialized, setIsMessagesInitialized] =
    useState<boolean>(false);
  const { user } = useContext(AuthenticationContext);
  const { chats, is_chats_initialized, getLastRead } = useContext(ChatsContext);
  const db = useSQLiteContext();

  const setMessageMap = (
    chat_id: number,
    messages_object: MessageContextObjectProps
  ) => {
    setMessages(new Map(messages.set(Number(chat_id), messages_object)));
  };

  // Take the "load" action for a friend's chat
  const loadMessagesById = async (chat_id: number) => {
    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      //Load messages
      const is_initial_load = false;
      console.info(
        "loadMessagesById() at messages.context.tsx is calling: getLoadedMessages()"
      );
      const newly_loaded_messages_object = await getLoadedMessages(
        user?.username || "",
        chat_id,
        target_messages_object,
        NUM_OF_MESSAGES_LOAD_AT_ONCE,
        db,
        is_initial_load
      );

      // Replace the target message object by the loaded one
      setMessageMap(chat_id, newly_loaded_messages_object);
    } else {
      console.warn(
        `at getLoadedMessagesObjectById() in messages.context.tsx: chat_id:${chat_id} DOES NOT EXIST`
      );
    }
  };

  const sendMessage = async (
    chat_id: number,
    username: string,
    text_content: string | null,
    file_url: string | null,
    temp_timestamp: string
  ) => {
    const new_message = {
      message_id: -1,
      sender_username: username,
      text_content: text_content || "",
      file_url: file_url || "",
      content_type: text_content ? "text" : "file",
      timestamp: temp_timestamp,
    };

    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
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
      setMessageMap(chat_id, updated_messages_object);
      const success = await MessageServer.SendChatMessage(
        user?.username || "",
        user?.secret || "",
        chat_id,
        text_content,
        file_url,
        temp_timestamp
      );
      return success;
    } else {
      console.warn(
        `at addMessageById() in messages.context.tsx: chat_id ${chat_id} DOES NOT EXIST`
      );
      return false;
    }
  };

  // Add a newly sent or recevied message to local storage and context
  // const conformMessageIsSent = async (
  //   username: string,
  //   chat_id: number,
  //   ce_message: CE_MessageProps
  // ) => {
  //   // store new message to local storage
  //   console.info(
  //     "addMessageById() at messages.context.tsx is calling: storeMessage()"
  //   );
  //   const new_message = MessagesStorage.storeMessage(
  //     username,
  //     chat_id,
  //     ce_message,
  //     db
  //   );

  //   if (new_message) {
  //     // find the index of original message object
  //     const target_messages_object = messages.get(Number(chat_id));

  //     if (target_messages_object) {
  //       const target_message_index =
  //         target_messages_object.loaded_messages.findIndex((message) => {
  //           message.timestamp === ce_message.custom_json;
  //         });

  //       target_messages_object.loaded_messages[target_message_index] =
  //         new_message;

  //       // Replace the target message object by the loaded one
  //       setMessageMap(chat_id, target_messages_object);

  //       await MessagesStorage.storeMessage(username, chat_id, ce_message, db);
  //     } else {
  //       console.warn(
  //         `at addMessageById() in messages.context.tsx: chat_id ${chat_id} DOES NOT EXIST`
  //       );
  //     }
  //   }
  // };

  const receiveMessage = (
    username: string,
    chat_id: number,
    ce_message: CE_MessageProps
  ): boolean => {
    const target_messages_object = messages.get(Number(chat_id));

    if (!target_messages_object) {
      console.log(
        `in receiveMessage() at messages.context.tsx: messgae send to unknown chat: ${chat_id}`
      );
      return false;
    }

    const received_message = {
      message_id: ce_message.id,
      sender_username: ce_message.sender_username,
      text_content: ce_message.text || "",
      file_url:
        !ce_message.text && ce_message.attachments.length > 0
          ? ce_message.attachments[0]
          : "",
      content_type: ce_message.text ? "text" : "file",
      timestamp: ce_message.created,
    } as MessagesProps;

    const target_message_index =
      target_messages_object.loaded_messages.findIndex((msg) => {
        return msg.timestamp === ce_message.custom_json;
      });

    // This new message is sent by myself
    if (target_message_index !== -1) {
      console.log(`Confirmed a message ${ce_message.id} is sent by myself`);

      const updated_loaded_messages = target_messages_object.loaded_messages;

      updated_loaded_messages[target_message_index] = received_message;

      const updated_messages_object = {
        chat_id: target_messages_object.chat_id,
        loaded_messages: updated_loaded_messages,
        current_index: target_messages_object.current_index,
        total_messages_amount: target_messages_object.total_messages_amount,
      } as MessageContextObjectProps;

      setMessageMap(chat_id, updated_messages_object);
    }
    // This message is sent by other
    else {
      console.log(
        `A new message ${ce_message.id} is sent from ${ce_message.sender_username}`
      );
      const updated_messages_object = {
        chat_id: target_messages_object.chat_id,
        loaded_messages: [
          received_message,
          ...target_messages_object.loaded_messages,
        ],
        current_index: target_messages_object.current_index + 1,
        total_messages_amount: target_messages_object.total_messages_amount + 1,
      } as MessageContextObjectProps;
      setMessageMap(chat_id, updated_messages_object);
    }
    //await MessagesStorage.storeMessage(username, chat_id, ce_message, db);
    console.log(`New message ${ce_message.id} is received`);
    return true;
  };

  // Use for switching back from chat screen to chat list screen
  const resetLoadedMessagesById = async (chat_id: number) => {
    // find the index original message object
    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      // const target_messages_object = messages_object_list[target_object_index];

      const end_index = Math.min(
        target_messages_object.total_messages_amount,
        NUM_OF_MESSAGES_LOAD_AT_ONCE
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
      setMessageMap(chat_id, updated_messages_object);
    } else {
      try {
        console.info(
          `Message ojbect with chat_id: ${chat_id} does not exist in message context`
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
          NUM_OF_MESSAGES_LOAD_AT_ONCE,
          db,
          is_initial_load
        );

        // Append new messages object to object list
        setMessageMap(chat_id, newly_loaded_messages_object);
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
    const target_messages_object = messages.get(Number(chat_id));

    if (target_messages_object) {
      // construct a mock messages oject with a empty message list
      let cleared_messages_object: MessageContextObjectProps = {
        chat_id: chat_id,
        loaded_messages: [],
        current_index: 0,
        total_messages_amount: 0,
      };

      // Replace the target message object by the loaded one
      setMessageMap(chat_id, cleared_messages_object);
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
        for (const chat of chats.values()) {
          const last_read = await getLastRead(chat.id);
          const ce_message_object_list =
            await MessageServer.GetUnreadChatMessages(
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

      // Fetach all messages from loacl storage for each friend
      for (const chat of chats.values()) {
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
            NUM_OF_MESSAGES_LOAD_AT_ONCE,
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
        setMessageMap(chat.id, initial_messages_object);
      }
      console.log(
        "Finish fetching messages data from local storage to context..."
      );

      console.info("Initialize message context successfully...");
      setIsMessagesInitialized(true);
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
        messages,
        loadMessagesById,
        sendMessage,
        receiveMessage,
        resetLoadedMessagesById,
        ClearAllMessagesById,
        is_messages_initialized,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};
