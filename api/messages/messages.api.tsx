import { CE_MessageProps } from "@/constants/ChatEngineObjectTypes";
import axios from "axios";
import * as FileSystem from "expo-file-system";

export const SendChatMessage = async (
  username: string,
  secret: string,
  chat_id: number,
  content: string,
  temp_timestamp: string
) => {
  if (username.length === 0 || secret.length === 0) {
    console.warn(
      `[Message API] SendChatMessage(): username or secret is undefined: ${chat_id}`
    );
    return false;
  }

  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/messages/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID || "",
    "User-Name": username,
    "User-Secret": secret,
  };

  const data = {
    text: content,
    custom_json: temp_timestamp,
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(`[Message API] POST: SendChatMessage() for ${username}`);
    return true;
  } catch (err) {
    console.error(`[Message API] POST: SendChatMessage() ERROR: ${err}`);
    return false;
  }
};

export const GetLatestChatMessages = async (
  username: string,
  secret: string,
  chat_id: number,
  messages_count: number
): Promise<CE_MessageProps[]> => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/messages/latest/${messages_count}/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`[Message API] GET: GetLatestChatMessages() for ${username}`);
    return response.data;
  } catch (err) {
    console.error(`[Message API] GET: GetLatestChatMessages() ERROR:`, err);
    return [];
  }
};

export const GetUnreadChatMessages = async (
  username: string,
  secret: string,
  chat_id: number,
  last_read_message_id: number
): Promise<CE_MessageProps[]> => {
  const AMOUNT_OF_MESSAGES_GET_AT_ONCE = 20;

  let last_messages_amount = 0;
  let curr_messages_count = AMOUNT_OF_MESSAGES_GET_AT_ONCE;
  let messages = [] as CE_MessageProps[];

  while (true) {
    messages = await GetLatestChatMessages(
      username,
      secret,
      chat_id,
      curr_messages_count
    );
    // all message has been fetche from server
    if (messages.length === last_messages_amount) {
      return messages;
    }
    if (messages[0].id <= last_read_message_id) {
      // return unread message
      const unread_messages = messages.filter(
        (message) => message.id > last_read_message_id
      );
      console.log(
        `[Message API] ${unread_messages.length} unread messages has been fected from server for chat ${chat_id}`
      );
      return unread_messages;
    }
    last_messages_amount = messages.length;
    curr_messages_count += AMOUNT_OF_MESSAGES_GET_AT_ONCE;
  }
};

// export const ReadMessage = async (
//   username: string,
//   secret: string,
//   chat_id: number,
//   last_read_message_id: number
// ) => {
//   const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/people/`;

//   const headers = {
//     "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
//     "User-Name": username,
//     "User-Secret": secret,
//   };

//   const data = new FormData();
//   data.append("last_read", last_read_message_id.toString());

//   try {
//     await axios.patch(url, data, { headers });
//     console.log(
//       `PATCH Request: ReadMessage() for ${username}: updated lastest read message as ${last_read_message_id}`
//     );
//   } catch (err: any) {
//     console.error(`PATCH Request: ReadMessage() ERROR:`, err.message);
//   }
// };

// export const GetChatMessages = async (
//   username: string,
//   secret: string,
//   chat_id: number
// ): Promise<CE_MessageProps[]> => {
//   const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/messages`;

//   const headers = {
//     "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
//     "User-Name": username,
//     "User-Secret": secret,
//   };

//   try {
//     const response = await axios.get(url, { headers });
//     console.log(`GET Request: GetChatMessages() for ${username}`);
//     return response.data;
//   } catch (err) {
//     console.error(`GET Request: GetChatMessages() ERROR:`, err);
//     return [];
//   }
// };
