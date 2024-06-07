import axios from "axios";
import { ContactStorageProps } from "@/constants/ContextTypes";
import { CE_UserProps } from "@/constants/ChatEngineObjectTypes";

export const GetUser = async (
  user_id: number
): Promise<ContactStorageProps | null> => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/users/${user_id}/`;

  const headers = {
    "PRIVATE-KEY": process.env.EXPO_PUBLIC_PRIVATE_KEY,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`[Contact API] GET: GetUser() for ${user_id}`);
    const user: CE_UserProps = response.data;
    const contact: ContactStorageProps = {
      id: user.id,
      contact: {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        custom_json: user.custom_json,
        is_online: user.is_online,
      },
    };
    return contact;
  } catch (err: any) {
    if (err.message.includes("status code 404")) {
      console.log(
        `[Contact Storage] fetchAllContacts(): contact ${user_id} not found`
      );
    } else {
      console.error(`[Chat API] GET: GetMyChats() ERROR:`, err);
    }
    return null;
  }
};
