import AsyncStorage from "@react-native-async-storage/async-storage";
import { CE_PersonProps } from "@/constants/ChatEngineObjectTypes";
import { ContactStorageProps } from "@/constants/ContextTypes";
import * as FileSystem from "expo-file-system";

export const setContact = async (
  username: string | undefined,
  contact_id: number,
  contact_data_json: CE_PersonProps
) => {
  if (!username) {
    console.error("[Contact Storage] setContact(): user is undefined");
    return;
  }
  try {
    const contact: ContactStorageProps = {
      id: contact_id,
      contact: contact_data_json,
    };
    const key = `${username}_contact_${contact_id.toString()}`;
    const value = JSON.stringify(contact);
    await AsyncStorage.setItem(key, value);

    console.log(
      `[Contact Storage] add or update contact data for contact ${contact_id}`
    );
  } catch (err) {
    console.error("[Contact Storage] setContact(): " + err);
  }
};

export const removeContact = async (
  username: string | undefined,
  contact_id: number
) => {
  try {
    if (!username) {
      console.error("[Contact Storage] removeContact(): user is undefined");
      return;
    }
    const key = `${username}_contact_${contact_id.toString()}`;
    await AsyncStorage.removeItem(key);
    console.log(`[Contact Storage] remove contact ${contact_id} from storage`);
  } catch (err) {
    console.error("[Contact Storage] removeContact(): " + err);
  }
};

export const fetchAllContacts = async (
  username: string | undefined
): Promise<ContactStorageProps[]> => {
  if (!username) {
    console.error("[Contact Storage] fetchAllContacts(): user is undefined");
    return [];
  }
  try {
    const all_keys = await AsyncStorage.getAllKeys();
    if (all_keys.length === 0) {
      return [];
    }
    const key_prefix = `${username}_contact_`;
    const target_keys = all_keys.filter((key) => key.startsWith(key_prefix));
    const all_contact_key_value_pair = await AsyncStorage.multiGet(target_keys);
    if (all_contact_key_value_pair.length === 0) {
      console.log(`[Contact Storage] there in no contact in storage`);
      return [];
    }
    const all_contacts_string = all_contact_key_value_pair.map(
      (pair) => pair[1]
    );
    const all_contacts_json = all_contacts_string.map((contact_string) =>
      JSON.parse(contact_string || "{}")
    );
    console.log(`[Contact Storage] fetch all contacts data from storage`);
    return all_contacts_json;
  } catch (err) {
    console.error("[Contact Storage] fetchAllContacts(): " + err);

    return [];
  }
};
