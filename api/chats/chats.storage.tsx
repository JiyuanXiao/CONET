import AsyncStorage from "@react-native-async-storage/async-storage";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";

export const setChat = async (
  username: string | undefined,
  chat_id: number,
  chat_data_json: CE_ChatProps
) => {
  if (!username) {
    console.error("[Chat Storage] setChat(): user is undefined");
    return;
  }
  try {
    const key = `${username}_chat_${chat_id.toString()}`;
    const value = JSON.stringify(chat_data_json);
    await AsyncStorage.setItem(key, value);
    console.log(`[Chat Storage] add or update chat data for chat ${chat_id}`);
  } catch (err) {
    console.error("[Chat Storage] setChat(): " + err);
  }
};

export const removeAllChats = async (username: string | undefined) => {
  if (!username) {
    console.error("[Chat Storage] removeAllChats(): user is undefined");
    return;
  }
  try {
    const all_keys = await AsyncStorage.getAllKeys();
    const key_prefix = `${username}_chat_`;
    const target_keys = all_keys.filter((key) => key.startsWith(key_prefix));
    await AsyncStorage.multiRemove(target_keys);
    console.log(`[Chat Storage] remove all chats data from storage`);
  } catch (err) {
    console.error("[Chat Storage] removeMultiChats(): " + err);
  }
};

export const fetchAllChats = async (
  username: string | undefined
): Promise<CE_ChatProps[]> => {
  if (!username) {
    console.error("[Chat Storage] fetchAllChats(): user is undefined");
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
    console.log(`[Chat Storage] fetch all chats data from storage`);
    return all_chats_json;
  } catch (err) {
    console.error("[Chat Storage] fetchAllChats(): " + err);
    return [];
  }
};

export const removeChat = async (
  username: string | undefined,
  chat_id: number
) => {
  try {
    if (!username) {
      console.error("[Chat Storage] removeChat(): user is undefined");
      return;
    }
    const key = `${username}_chat_${chat_id.toString()}`;
    await AsyncStorage.removeItem(key);
    console.log(`[Chat Storage] remove chat ${chat_id} from storage`);
  } catch (err) {
    console.error("[Chat Storage] removeChat(): " + err);
  }
};

export const setLastRead = async (
  username: string | undefined,
  chat_id: number,
  last_read_message_id: number
) => {
  if (last_read_message_id < 0) {
    console.log(
      "[Chat Storage] setLastRead(): invalid last read id: " +
        last_read_message_id
    );
    return;
  }
  if (!username) {
    console.error("[Chat Storage] setLastRead(): user is undefined");
    return;
  }
  try {
    const key = `${username}_last_read_${chat_id.toString()}`;
    await AsyncStorage.setItem(key, last_read_message_id.toString());
    console.log(
      `[Chat Storage] set chat ${chat_id} last read as ${last_read_message_id}`
    );
  } catch (err) {
    console.error("[Chat Storage] setLastRead(): " + err);
  }
};

export const getLastRead = async (
  username: string | undefined,
  chat_id: number
): Promise<number> => {
  if (!username) {
    console.error("[Chat Storage] getLastRead(): user is undefined");
    return -1;
  }
  try {
    const key = `${username}_last_read_${chat_id.toString()}`;
    const last_read = await AsyncStorage.getItem(key);
    if (!last_read) {
      console.warn(
        `[Chat Storage] Chat ${chat_id} doesn't have last read data in storage yet`
      );
      return 0;
    }
    console.log("[Chat Storage] get last read data for chat: " + chat_id);
    return Number(last_read);
  } catch (err) {
    console.error("[Chat Storage] getLastRead(): " + err);
    return -1;
  }
};

export const deleteLastRead = async (
  username: string | undefined,
  chat_id: number
) => {
  if (!username) {
    console.error("[Chat Storage] deleteLastRead(): user is undefined");
    return;
  }
  try {
    const key = `${username}_last_read_${chat_id.toString()}`;
    await AsyncStorage.removeItem(key);
    console.log(
      `[Chat Storage] delete last read data for chat: ${chat_id.toString()}`
    );
  } catch (err) {
    console.error("[Chat Storage] deleteLastRead(): " + err);
  }
};
