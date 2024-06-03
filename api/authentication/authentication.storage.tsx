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
