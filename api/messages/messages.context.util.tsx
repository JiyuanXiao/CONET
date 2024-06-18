import { SQLiteDatabase } from "expo-sqlite";
import { MessageContextObjectProps } from "@/constants/ContextTypes";
import * as MessagesStorage from "./messages.storage";

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

    // const all_messages = await MessagesStorage.fetchAllMessages(
    //   username,
    //   chat_id,
    //   db
    // );
    // console.log("[Message Context] fetched all messages from storage ");

    // const msg_list_len = all_messages.length;

    // if (
    //   messages_object.total_messages_amount > 0 &&
    //   messages_object.total_messages_amount !== msg_list_len
    // ) {
    //   console.warn(
    //     "[Message Context] getLoadedMessages(): Message Context messages amount does not match with Local Storage message list length"
    //   );
    // }

    // const end_index = Math.min(msg_list_len, start_index + num_of_msg_load);

    // const loaded_messages = all_messages.slice(start_index, end_index);

    const loaded_messages = await MessagesStorage.fetchChunkOfMessages(
      username,
      chat_id,
      num_of_msg_load,
      start_index,
      db
    );
    const end_index = start_index + loaded_messages.length;
    const msg_list_len = await MessagesStorage.getTotalRowCount(
      username,
      chat_id,
      db
    );

    const new_messages_object: MessageContextObjectProps = {
      chat_id: messages_object.chat_id,
      loaded_messages: [...messages_object.loaded_messages, ...loaded_messages],
      current_index: end_index,
      total_messages_amount: Number(msg_list_len),
    };

    return new_messages_object;
  } else {
    return messages_object;
  }
};
