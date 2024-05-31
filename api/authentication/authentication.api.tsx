import axios from "axios";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

//const MOCK_USERS_AUTH = require("../../mock_data/users.mock.json");

export const GetMyAccount = async (
  username: string,
  pw: string
): Promise<CE_UserProps | null> => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/me/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": pw,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`GET Request: GetMyAccount() for ${username}`);
    return response.data;
  } catch (err) {
    console.error(`GET Request: GetMyAccount() ERROR:`, err);
    return null;
  }
};
