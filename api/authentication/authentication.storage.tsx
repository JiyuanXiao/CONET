import AsyncStorage from "@react-native-async-storage/async-storage";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

export const storeAuthenticatedUser = async (user_data_json: CE_UserProps) => {
  try {
    const user_date_string = JSON.stringify(user_data_json);
    await AsyncStorage.setItem("authenticated-user", user_date_string);
  } catch (err) {
    console.error(
      "at storeAuthenticatedUser() in authentication.storage.tsx: " + err
    );
  }
};

export const removeAuthenticatedUser = async () => {
  try {
    await AsyncStorage.removeItem("authenticated-user");
  } catch (err) {
    console.error(
      "at removeAuthenticatedUser() in authentication.storage.tsx: " + err
    );
  }
};

export const fetchAuthenticatedUser =
  async (): Promise<CE_UserProps | null> => {
    try {
      const user_data_string = await AsyncStorage.getItem("authenticated-user");
      return user_data_string != null ? JSON.parse(user_data_string) : null;
    } catch (err) {
      console.error(
        "at fetchAuthenticatedUser() in authentication.storage.tsx: " + err
      );
      return null;
    }
  };
