import AsyncStorage from "@react-native-async-storage/async-storage";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";

export const setChat = async (
  username: string | undefined,
  chat_id: number,
  chat_data_json: CE_ChatProps
) => {
  if (!username) {
    console.error("at setChat() in chats.storage.tsx: user is undefined");
    return;
  }
  try {
    const key = `${username}_chat_${chat_id.toString()}`;
    const value = JSON.stringify(chat_data_json);
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.error("at setChat() in chats.storage.tsx: " + err);
  }
};

export const removeAllChats = async (username: string | undefined) => {
  if (!username) {
    console.error("at setChat() in chats.storage.tsx: user is undefined");
    return;
  }
  try {
    const all_keys = await AsyncStorage.getAllKeys();
    const key_prefix = `${username}_chat_`;
    const target_keys = all_keys.filter((key) => key.startsWith(key_prefix));
    await AsyncStorage.multiRemove(target_keys);
  } catch (err) {
    console.error("at removeMultiChats() in chats.storage.tsx: " + err);
  }
};

export const fetchAllChats = async (
  username: string | undefined
): Promise<CE_ChatProps[]> => {
  if (!username) {
    console.error("at setChat() in chats.storage.tsx: user is undefined");
    return [];
  }
  try {
    const all_keys = await AsyncStorage.getAllKeys();
    if (all_keys.length === 0) {
      return [];
    }
    const key_prefix = `${username}_chat_`;
    const target_keys = all_keys.filter((key) => key.startsWith(key_prefix));
    const all_chat_key_value_pair = await AsyncStorage.multiGet(target_keys);
    if (all_chat_key_value_pair.length === 0) {
      return [];
    }
    const all_chats_string = all_chat_key_value_pair.map((pair) => pair[1]);
    const all_chats_json = all_chats_string.map((chat_string) =>
      JSON.parse(chat_string || "{}")
    );
    return all_chats_json;
  } catch (err) {
    console.error("at fetchAllChats() in chats.storage.tsx: " + err);
    return [];
  }
};

export const removeChat = async (
  username: string | undefined,
  chat_id: number
) => {
  try {
    if (!username) {
      console.error("at setChat() in chats.storage.tsx: user is undefined");
      return;
    }
    const key = `${username}_chat_${chat_id.toString()}`;
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error("at removeChat() in chats.storage.tsx: " + err);
  }
};

export const setLastRead = async (
  username: string | undefined,
  chat_id: number,
  last_read_message_id: number
) => {
  if (last_read_message_id < 0) {
    return;
  }
  if (!username) {
    console.error("at setLastRead() in chats.storage.tsx: user is undefined");
    return;
  }
  try {
    const key = `${username}_last_read_${chat_id.toString()}`;
    await AsyncStorage.setItem(key, last_read_message_id.toString());
    console.log(
      `Chat Storage: Set chat ${chat_id} last read as ${last_read_message_id}`
    );
  } catch (err) {
    console.error("at setLastRead() in chats.storage.tsx: " + err);
  }
};

export const getLastRead = async (
  username: string | undefined,
  chat_id: number
): Promise<number> => {
  if (!username) {
    console.error("at getLastRead() in chats.storage.tsx: user is undefined");
    return -1;
  }
  try {
    const key = `${username}_last_read_${chat_id.toString()}`;
    const last_read = await AsyncStorage.getItem(key);
    console.log("getLastRead for " + chat_id);
    return Number(last_read);
  } catch (err) {
    console.error("at getLastRead() in chats.storage.tsx: " + err);
    return -1;
  }
};

export const deleteLastRead = async (
  username: string | undefined,
  chat_id: number
) => {
  if (!username) {
    console.error(
      "at deleteLastRead() in chats.storage.tsx: user is undefined"
    );
    return;
  }
  try {
    const key = `${username}_last_read_${chat_id.toString()}`;
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error("at deleteLastRead() in chats.storage.tsx: " + err);
  }
};
