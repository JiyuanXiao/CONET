import AsyncStorage from "@react-native-async-storage/async-storage";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

export const storeAuthenticatedUser = async (user_data_json: CE_UserProps) => {
  try {
    const user_date_string = JSON.stringify(user_data_json);
    await AsyncStorage.setItem("authenticated-user", user_date_string);
    console.log(`[Auth Storage] store user data to storage`);
  } catch (err) {
    console.error("[Auth Storage] storeAuthenticatedUser(): " + err);
  }
};

export const removeAuthenticatedUser = async () => {
  try {
    await AsyncStorage.removeItem("authenticated-user");
    console.log(`[Auth Storage] remove user data from storage`);
  } catch (err) {
    console.error("[Auth Storage] removeAuthenticatedUser(): " + err);
  }
};

export const fetchAuthenticatedUser =
  async (): Promise<CE_UserProps | null> => {
    try {
      const user_data_string = await AsyncStorage.getItem("authenticated-user");
      console.log(`[Auth Storage] get user data from storage`);
      return user_data_string != null ? JSON.parse(user_data_string) : null;
    } catch (err) {
      console.error("[Auth Storage] fetchAuthenticatedUser(): " + err);
      return null;
    }
  };

// export const saveAvatarToFilesystem = async (
//   username: string | undefined,
//   avatar_url: string | null
// ) => {
//   if (!username) {
//     console.error("[Auth Storage] saveAvatarToFilesystem(): user is undefined");
//     return null;
//   }

//   if (!avatar_url) {
//     console.error(
//       "[Auth Storage] saveAvatarToFilesystem(): avatar is undefined"
//     );
//     return "";
//   }
//   const avatar_directory = `${FileSystem.documentDirectory}${username}/avatar/`;

//   // const file_extension_match = avatar_url.match(/\/avatars\/[^?]+\.(\w+)\?/);
//   // let file_extension = "";
//   // if (!file_extension_match) {
//   //   file_extension = "png";
//   //   console.warn(
//   //     `[Auth Storage] saveAvatarToFilesystem(): can not find avatar's file extension from url, set to default: "png"`
//   //   );
//   // } else {
//   //   file_extension = file_extension_match[1];
//   // }
//   const avatar_path = `${avatar_directory}${username}.png`;
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
//         `[Auth Storage] saveAvatarToFilesystem(): failed to download avatar for ${username}`
//       );
//       return null;
//     }
//     return download_result.uri;
//   } catch (err) {
//     console.warn(
//       `[Auth Storage] saveAvatarToFilesystem(): failed to download avatar for ${username}`
//     );
//     return null;
//   }
// };
