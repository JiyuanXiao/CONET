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
        `[Contact API] fetchAllContacts(): contact ${user_id} not found`
      );
    } else {
      console.error(`[Contact API] GET: GetMyChats() ERROR:`, err);
    }
    return null;
  }
};

export const GetContacts = async (username: string, secret: string) => {
  try {
    const url = `${process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL}/contact/`;

    const headers = {
      "SECRET-KEY": process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_KEY,
      "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
      "User-Name": username,
      "User-Secret": secret,
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const contact_id: { contact_id: number[] } = response.data;
      return contact_id;
    }

    return null;
  } catch (err: any) {
    console.log(`[Contact API] Failed to get contacts: ${err}`);
    return null;
  }
};

export const AddContact = async (
  username: string,
  secret: string,
  contact_id: number
) => {
  try {
    const url = `${process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL}/contact/`;

    const headers = {
      "SECRET-KEY": process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_KEY,
      "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
      "User-Name": username,
      "User-Secret": secret,
    };

    const body = {
      contact_id: contact_id,
    };

    const response = await axios.post(url, body, { headers });

    if (response.status === 201 || response.status === 200) {
      return true;
    }

    return false;
  } catch (err: any) {
    console.log(`[Contact API] add contact failed: ${err}`);
    return false;
  }
};

export const DeleteContact = async (
  username: string,
  secret: string,
  contact_id: number
) => {
  try {
    const url = `${process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_URL}/contact/`;

    const headers = {
      "SECRET-KEY": process.env.EXPO_PUBLIC_NOTIFICATION_SERVER_KEY,
      "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
      "User-Name": username,
      "User-Secret": secret,
    };

    const body = {
      contact_id: contact_id,
    };

    const response = await axios.put(url, body, { headers });

    if (response.status === 200) {
      return true;
    }

    return false;
  } catch (err: any) {
    console.log(`[Contact API] delete contact failed: ${err}`);
    return false;
  }
};
