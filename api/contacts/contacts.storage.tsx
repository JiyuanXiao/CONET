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

// export const saveAvatarToFilesystem = async (
//   username: string | undefined,
//   contact_username: string,
//   avatar_url: string
// ) => {
//   if (!username) {
//     console.error(
//       "[Contact Storage] saveAvatarToFilesystem(): user is undefined"
//     );
//     return null;
//   }
//   const avatar_directory = `${FileSystem.documentDirectory}${username}/contacts/avatars/`;

//   // const file_extension_match = avatar_url.match(/\/avatars\/[^?]+\.(\w+)\?/);
//   // let file_extension = "";
//   // if (!file_extension_match) {
//   //   file_extension = "png";
//   //   console.warn(
//   //     `[Contact Storage] saveAvatarToFilesystem(): can not find avatar's file extension from url, set to default: "png"`
//   //   );
//   // } else {
//   //   file_extension = file_extension_match[1];
//   // }
//   const avatar_path = `${avatar_directory}${contact_username}.png`;
//   try {
//     const dir_info = await FileSystem.getInfoAsync(avatar_directory);
//     if (!dir_info.exists) {
//       await FileSystem.makeDirectoryAsync(avatar_directory, {
//         intermediates: true,
//       });
//     }
//     const download_result = await FileSystem.downloadAsync(
//       avatar_url,
//       avatar_path
//     );
//     if (!download_result) {
//       console.warn(
//         `[Contact Storage] saveAvatarToFilesystem(): failed to download avatar for ${username}`
//       );
//       return null;
//     }
//     console.log(download_result.uri);
//     return download_result.uri;
//   } catch (err) {
//     console.warn(
//       `[Contact Storage] saveAvatarToFilesystem(): failed to download avatar for ${username}`
//     );
//     return null;
//   }
// };

// export const deleteAvatarFromFilesystem = async (avatar_uri: string) => {
//   try {
//     await FileSystem.deleteAsync(avatar_uri);
//     console.log`[Contact Storage] deleteAvatarFronFilesystem(): deleted:\n ${avatar_uri}`;
//   } catch (err) {
//     console.warn`[Contact Storage] deleteAvatarFronFilesystem(): error : ${err}`;
//   }
// };
