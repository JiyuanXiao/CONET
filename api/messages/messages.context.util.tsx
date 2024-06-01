import { SQLiteDatabase } from "expo-sqlite";
import { MessageContextObjectProps } from "@/constants/ContextTypes";
import * as MessagesStorage from "./messages.storage";

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
export const getLoadedMessages = async (
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
