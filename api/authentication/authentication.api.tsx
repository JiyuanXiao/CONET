import axios from "axios";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";
import { MyAccountResponseProps } from "@/constants/ContextTypes";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

//const MOCK_USERS_AUTH = require("../../mock_data/users.mock.json");

export const GetMyAccount = async (
  username: string,
  pw: string
): Promise<MyAccountResponseProps> => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/me/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": pw,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`[Auth API] GET: GetMyAccount() for ${username}`);
    const my_account_response: MyAccountResponseProps = {
      success: true,
      status: response.status,
      data: response.data,
      error: null,
    };
    return my_account_response;
  } catch (err: any) {
    if (err.response) {
      console.error(
        `[Auth API] GET: GetMyAccount() ERROR: ${err.response.status}:  ${err.response.data.detail}`
      );
      const error_info: MyAccountResponseProps = {
        success: false,
        status: err.response.status,
        data: null,
        error: err.response.data,
      };
      return error_info;
    } else {
      console.error(`[Auth API] GET: GetMyAccount() ERROR: ${err}`);
      const error_info: MyAccountResponseProps = {
        success: false,
        status: 0,
        data: null,
        error: err.message,
      };
      return error_info;
    }
  }
};

export const UpdateMyAccount = async (
  username: string,
  pw: string,
  new_name: string | null,
  new_password: string | null,
  avatar_index: number | null
) => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/me/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": pw,
  };

  let data;

  if (!new_name && !new_password && avatar_index === null) {
    return 0;
  } else if (new_name) {
    data = {
      first_name: new_name,
    };
  } else if (new_password) {
    data = {
      secret: new_password,
    };
  } else if (avatar_index !== null) {
    data = {
      custom_json: avatar_index.toString(),
    };
  } else {
    return 0;
  }

  try {
    const response = await axios.patch(url, data, { headers });
    if (response.status === 200) {
      console.log(`[Auth API] Account inforamtion changed successfully...`);
      return Number(response.status);
    } else {
      console.warn(
        `[Auth API] Account inforamtion changed failed: ${
          response.status
        } ${JSON.stringify(response.data, null, 2)}`
      );
      return Number(response.status);
    }
  } catch (err: any) {
    console.error(`[Auth API]  UpdateMyAccount() error: ${err}`);

    return 0;
  }
};
