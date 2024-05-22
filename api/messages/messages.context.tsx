import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchAllFriends,
  createFriendTableIfNotExists,
} from "../friends/friends.storage";
import {
  messageTableExist,
  fetchAllMessages,
  storeMessage,
  deleteMessageTableIfExists,
  createMessageTableIfNotExists,
} from "./messages.storage";
import { useSQLiteContext, SQLiteDatabase } from "expo-sqlite";
import { MessagesProps, MessagesDateabseProps } from "@/constants/Types";
import { AuthenticationContext } from "../authentication/authentication.context";
import { UserProps } from "@/constants/Types";

interface MessageContextObjectProps {
  friend_id: string;
  loaded_messages: MessagesProps[];
  current_index: number; // THis is the first unloaded messages index
  total_messages_amount: number;
}

export const MessagesContext = createContext({
  messages_object_list: [] as MessageContextObjectProps[],
  getLoadedMessagesObjectById: (id: string) =>
    undefined as MessageContextObjectProps | undefined,
  loadMessagesById: (id: string) => {},
  addMessageById: (
    user_id: string,
    friend_id: string,
    message: MessagesDateabseProps
  ) => {},
  resetLoadedMessagesById: (id: string) => {},
  ClearAllMessagesById: (id: string) => {},
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
  user_id: string,
  friend_id: string,
  messages_object: MessageContextObjectProps,
  num_of_msg_load: number,
  db: SQLiteDatabase,
  is_initial_load: boolean
) => {
  // Load messages if not all messages have been loaded
  // If this is initial load, the index and messages amount indicators is inaccurate, so perfrom the load anyhow
  if (
    is_initial_load ||
    messages_object.current_index < messages_object.total_messages_amount
  ) {
    const start_index = messages_object.current_index;

    console.info(
      "getLoadedMessages() at messages.context.tsx is calling: fetchAllMessages()"
    );
    const all_messages = await fetchAllMessages(user_id, friend_id, db);

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
      friend_id: messages_object.friend_id,
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

  const [messages_object_list, setMessagesObjectList] = useState<
    MessageContextObjectProps[]
  >([]);

  const initialSetUpObjectList = async (user: UserProps) => {
    console.info("Start to initialize message context...");
    createFriendTableIfNotExists(user.account_id, db);
    console.info(
      "initialSetUpObjectList() at messages.context.tsx is calling: fetchAllMessages()"
    );
    const friends = fetchAllFriends(user.account_id, db);
    let initialMessagesObjectList: MessageContextObjectProps[] = [];

    // Fetach all messages from loacl storage for each friend
    for (const friend of friends) {
      let initial_messages_object = {
        friend_id: friend.friend_id,
        loaded_messages: [],
        current_index: 0,
        total_messages_amount: 0,
      } as MessageContextObjectProps;

      // If message data existed already, load the data
      if (messageTableExist(user.account_id, friend.friend_id, db)) {
        const is_initial_load = true;
        console.info(
          "initialSetUpObjectList() at messages.context.tsx is calling: getLoadedMessages()"
        );
        initial_messages_object = await getLoadedMessages(
          user.account_id,
          friend.friend_id,
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
        createMessageTableIfNotExists(user.account_id, friend.friend_id, db);
      }

      // Append new messages object to object list
      initialMessagesObjectList = [
        ...initialMessagesObjectList,
        initial_messages_object,
      ];
    }

    setMessagesObjectList(initialMessagesObjectList);
    console.info("Initialize message context successfully...");
  };

  // Get loaded message object for a friend
  const getLoadedMessagesObjectById = (id: string) => {
    const target_messages_object = messages_object_list.find(
      (messages_object) => messages_object.friend_id === id
    );
    return target_messages_object;
  };

  // Take the "load" action for a friend's chat
  const loadMessagesById = async (id: string) => {
    // find the index of original message object
    const target_object_index = messages_object_list.findIndex(
      (messages_object) => messages_object.friend_id === id
    );

    if (target_object_index !== -1) {
      const target_messages_object = messages_object_list[target_object_index];
      //Load messages
      const is_initial_load = false;
      console.info(
        "loadMessagesById() at messages.context.tsx is calling: getLoadedMessages()"
      );
      const newly_loaded_messages_object = await getLoadedMessages(
        user?.account_id || "",
        id,
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
        `at getLoadedMessagesObjectById() in messages.context.tsx: friend_id ${id} DOES NOT EXIST`
      );
    }
  };

  // Add a newly sent or recevied message to local storage and context
  const addMessageById = (
    user_id: string,
    friend_id: string,
    message: MessagesDateabseProps
  ) => {
    // store new message to local storage
    console.info(
      "addMessageById() at messages.context.tsx is calling: storeMessage()"
    );
    const new_message = storeMessage(user_id, message);

    if (new_message) {
      // find the index of original message object
      const target_object_index = messages_object_list.findIndex(
        (messages_object) => messages_object.friend_id === friend_id
      );

      if (target_object_index !== -1) {
        const target_messages_object =
          messages_object_list[target_object_index];

        // Construct the message object by appending the new message
        const updated_messages_object: MessageContextObjectProps = {
          friend_id: friend_id,
          loaded_messages: [
            new_message,
            ...target_messages_object.loaded_messages,
          ],
          current_index: target_messages_object.current_index + 1,
          total_messages_amount:
            target_messages_object.total_messages_amount + 1,
        };

        // Replace the target message object by the loaded one
        const updated_messages_object_list = [...messages_object_list];
        updated_messages_object_list[target_object_index] =
          updated_messages_object;
        setMessagesObjectList(updated_messages_object_list);
      } else {
        console.warn(
          `at addMessageById() in messages.context.tsx: friend_id ${friend_id} DOES NOT EXIST`
        );
      }
    }
  };

  // Use for switching back from chat screen to chat list screen
  const resetLoadedMessagesById = async (friend_id: string) => {
    // find the index original message object
    const target_object_index = messages_object_list.findIndex(
      (messages_object) => messages_object.friend_id === friend_id
    );

    if (target_object_index !== -1) {
      const target_messages_object = messages_object_list[target_object_index];

      const end_index = Math.min(
        target_messages_object.total_messages_amount,
        NUM_OF_LITEMS_TO_LOAD_AT_ONCE
      );

      // Construct the messages object in which the number of loaded messages is the default value
      const updated_messages_object: MessageContextObjectProps = {
        friend_id: friend_id,
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
          `Message ojbect with friend_id: ${friend_id} does not xxist in message context`
        );
        console.info(
          `Creating a new message object with friend_id: ${friend_id}...`
        );
        const initial_messages_object = {
          friend_id: friend_id,
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
          user?.account_id || "",
          friend_id,
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
          `New message object with friend_id: ${friend_id} is created successfully...`
        );
      } catch (err) {
        console.error(
          "at resetLoadedMessagesById() in messages.context.tsx: " + err
        );
      }
    }
  };

  const ClearAllMessagesById = async (friend_id: string) => {
    console.log("Start to clear all messages data for " + friend_id);
    deleteMessageTableIfExists(user?.account_id || "", friend_id, db);
    createMessageTableIfNotExists(user?.account_id || "", friend_id, db);

    // find the index of original message object
    const target_object_index = messages_object_list.findIndex(
      (messages_object) => messages_object.friend_id === friend_id
    );

    if (target_object_index !== -1) {
      // construct a mock messages oject with a empty message list
      let cleared_messages_object: MessageContextObjectProps = {
        friend_id: friend_id,
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
        user?.account_id || "",
        friend_id,
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
        `at ClearAllMessagesById() in messages.context.tsx: friend_id ${friend_id} DOES NOT EXIST`
      );
    }
  };

  useEffect(() => {
    if (user) {
      initialSetUpObjectList(user);
    }
  }, [user]);

  return (
    <MessagesContext.Provider
      value={{
        messages_object_list,
        getLoadedMessagesObjectById,
        loadMessagesById,
        addMessageById,
        resetLoadedMessagesById,
        ClearAllMessagesById,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};
