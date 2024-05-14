import React, { createContext, useState, useEffect } from "react";
import { getAllChats } from "../chats/chats.storage";
import { fetchAllMessages, storeMessage } from "./messages.storage";
import { useSQLiteContext, SQLiteDatabase } from "expo-sqlite";
import { MessagesProps, MessagesDateabseProps } from "@/constants/Types";

interface MessageContextObjectProps {
  chat_id: string;
  loaded_messages: MessagesProps[];
  current_index: number;
  total_messages_amount: number;
}

export const MessagesContext = createContext({
  messages_object_list: [] as MessageContextObjectProps[],
  getLoadedMessagesById: (id: string) => [] as MessagesProps[],
  loadMessagesById: (id: string) => {},
  addMessageById: (id: string, message: MessagesDateabseProps) => {},
  resetLoadedMessagesById: (id: string) => {},
});

// DESCRIPTION: loadMessages() is a helper function that load specific amount messages from local
//              storage to the message context object so that message can be rendered to the chat
//              window via message context
// PARAMETERS:
//              chat_id: ID of the chat which need to render more message
//              messages_object: the messages context object which need to be updated
//              num_of_msg_load: number of messages that need to render
//              db: the database object of the local storage
// RETURN:
//              return a new message context object in which the required messages have been loaded
const loadMessages = async (
  chat_id: string,
  messages_object: MessageContextObjectProps,
  num_of_msg_load: number,
  db: SQLiteDatabase
) => {
  const start_index = messages_object.current_index;

  const all_messages = await fetchAllMessages(chat_id, db);

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
};

export const MessagesContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const NUM_OF_LITEMS_TO_LOAD_AT_ONCE = 15;

  const db = useSQLiteContext();
  const chat_id_list = getAllChats(db);

  const [messages_object_list, setMessagesObjectList] = useState<
    MessageContextObjectProps[]
  >([]);

  const initialSetUpObjectList = async () => {
    let initialMessagesObjectList: MessageContextObjectProps[] = [];

    // Fetach all messages from loacl storage for each chat
    for (const chat_id of chat_id_list) {
      const initial_messages_object = {
        chat_id: chat_id,
        loaded_messages: [],
        current_index: 0,
        total_messages_amount: 0,
      };

      // First load
      const newly_loaded_messages_object = await loadMessages(
        chat_id,
        initial_messages_object,
        NUM_OF_LITEMS_TO_LOAD_AT_ONCE,
        db
      );

      // Append new messages object to object list
      initialMessagesObjectList = [
        ...initialMessagesObjectList,
        newly_loaded_messages_object,
      ];
    }

    setMessagesObjectList(initialMessagesObjectList);
  };

  // Get loaded message for a chat
  const getLoadedMessagesById = (id: string) => {
    const target_messages_object = messages_object_list.find(
      (messages_object) => messages_object.chat_id === id
    );
    return target_messages_object?.loaded_messages || [];
  };

  // Take the "load" action for a chat
  const loadMessagesById = async (id: string) => {
    // find the original message list of the chat
    const target_messages_object = messages_object_list.find(
      (messages_object) => messages_object.chat_id === id
    );

    if (target_messages_object) {
      // If not all messages have been loaded
      if (
        target_messages_object.current_index <
        target_messages_object.total_messages_amount
      ) {
        // Load messages
        const newly_loaded_messages_object = await loadMessages(
          id,
          target_messages_object,
          NUM_OF_LITEMS_TO_LOAD_AT_ONCE,
          db
        );

        // Get the index of the messages object in the object list
        const target_object_index = messages_object_list.findIndex(
          (messages_object) => messages_object.chat_id === id
        );

        // Replace the target message object by the loaded one
        const updated_messages_object_list = [...messages_object_list];
        updated_messages_object_list[target_object_index] =
          newly_loaded_messages_object;

        setMessagesObjectList(updated_messages_object_list);
      }
    } else {
      console.warn("LOAD_MESSAGES_BY_ID: target_messages_object NOT FOUND");
    }
  };

  // Add a newly sent or recevied message to local storage and context
  const addMessageById = (id: string, message: MessagesDateabseProps) => {
    // store new message to local storage
    const new_message = storeMessage(message);

    if (new_message) {
      // find the original message object of the chat
      const target_messages_object = messages_object_list.find(
        (messages_object) => messages_object.chat_id === id
      );

      if (target_messages_object) {
        // Construct the message object by appending the new message
        const updated_messages_object: MessageContextObjectProps = {
          chat_id: id,
          loaded_messages: [
            new_message,
            ...target_messages_object.loaded_messages,
          ],
          current_index: target_messages_object.current_index + 1,
          total_messages_amount:
            target_messages_object.total_messages_amount + 1,
        };

        // Get the index of the target messages object in the object list
        const target_object_index = messages_object_list.findIndex(
          (messages_object) => messages_object.chat_id === id
        );

        // Replace the target messages object by the updated one
        const updated_messages_object_list = [...messages_object_list];
        updated_messages_object_list[target_object_index] =
          updated_messages_object;
        setMessagesObjectList(updated_messages_object_list);
      } else {
        if (!target_messages_object) {
          console.warn("ADD_MESSAGE_BY_ID: target_messages_object NOT FOUND");
        } else {
          console.warn("ADD_MESSAGE_BY_ID: new_message is NULL");
        }
      }
    }
  };

  const resetLoadedMessagesById = (id: string) => {
    // find the original message object of the chat
    const target_messages_object = messages_object_list.find(
      (messages_object) => messages_object.chat_id === id
    );

    if (target_messages_object) {
      const end_index = Math.min(
        target_messages_object.total_messages_amount,
        NUM_OF_LITEMS_TO_LOAD_AT_ONCE
      );

      // Construct the messages object in which the number of loaded messages is the default value
      const updated_messages_object: MessageContextObjectProps = {
        chat_id: id,
        loaded_messages: target_messages_object.loaded_messages.slice(
          0,
          end_index
        ),
        current_index: end_index,
        total_messages_amount: target_messages_object.total_messages_amount,
      };

      // Get the index of the target messages object in the object list
      const target_object_index = messages_object_list.findIndex(
        (messages_object) => messages_object.chat_id === id
      );

      // Replace the target message object by the updated one
      const updated_messages_object_list = [...messages_object_list];
      updated_messages_object_list[target_object_index] =
        updated_messages_object;
      setMessagesObjectList(updated_messages_object_list);
    } else {
      if (!target_messages_object) {
        console.warn(
          "RESET_LOADED_MESSAGE_BY_ID: target_messages_object NOT FOUND"
        );
      } else {
        console.warn("RESET_LOADED_MESSAGE_BY_ID: new_message is NULL");
      }
    }
  };

  useEffect(() => {
    initialSetUpObjectList();
    console.log("initial set up message context");
  }, []);

  return (
    <MessagesContext.Provider
      value={{
        messages_object_list,
        getLoadedMessagesById,
        loadMessagesById,
        addMessageById,
        resetLoadedMessagesById,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};
