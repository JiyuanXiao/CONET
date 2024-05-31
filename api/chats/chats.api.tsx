import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import axios from "axios";

export const CreateChat = (
  username: string,
  secret: string,
  chat_title: string
) => {};

export const GetMyChats = async (
  username: string,
  secret: string
): Promise<CE_ChatProps[]> => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(`GET Request: GetMyChats() for ${username}`);
    return response.data;
  } catch (err) {
    console.error(`GET Request: GetMyChats() ERROR:`, err);
    return [];
  }
};

export const AddChatMember = (
  username: string,
  secret: string,
  chat_id: number,
  new_member_username: string
) => {};

export const RemoveChatMember = (
  username: string,
  secret: string,
  chat_id: number,
  target_member_username: string
) => {};

export const UpdateChatDetails = (
  username: string,
  secret: string,
  chat_id: number,
  new_chat_title: string
) => {};

export const DeleteChat = (
  username: string,
  secret: string,
  chat_id: number
) => {};
