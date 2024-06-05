import axios from "axios";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";
import { MyAccountResponseProps } from "@/constants/ContextTypes";

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

export const UpdateMyAccount = async () => {};
