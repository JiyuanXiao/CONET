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
    const chat_id_string = `${username}_chat_${chat_id.toString()}`;
    const chat_data_string = JSON.stringify(chat_data_json);
    await AsyncStorage.setItem(chat_id_string, chat_data_string);
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
    const all_chat_ids = all_keys.filter((key) => key.startsWith(key_prefix));
    await AsyncStorage.multiRemove(all_chat_ids);
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
    const all_chat_ids = all_keys.filter((key) => key.startsWith(key_prefix));
    const all_chat_key_value_pair = await AsyncStorage.multiGet(all_chat_ids);
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
    const chat_id_sting = `${username}_chat_${chat_id.toString()}`;
    await AsyncStorage.removeItem(chat_id_sting);
  } catch (err) {
    console.error("at removeChat() in chats.storage.tsx: " + err);
  }
};
