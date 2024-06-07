import {
  CE_ChatProps,
  CE_ChatMemberProps,
} from "@/constants/ChatEngineObjectTypes";
import axios from "axios";

export const CreateChat = async (
  username: string,
  secret: string,
  chat_title: string
) => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  const data = {
    title: chat_title,
    is_direct_chat: false,
  };

  try {
    const response = await axios.post(url, data, { headers });

    const new_chat: CE_ChatProps = response.data;
    console.log(
      `[Chat API] POST: Create new chat ${new_chat.id} for ${username}`
    );
    return new_chat.id;
  } catch (err) {
    console.error(`[Chat API] POST: CreateChat() ERROR: ${err}`);
    return null;
  }
};

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
    console.log(`[Chat API] GET: GetMyChats() for ${username}`);
    return response.data;
  } catch (err) {
    console.error(`[Chat API] GET: GetMyChats() ERROR:`, err);
    return [];
  }
};

export const AddChatMember = async (
  username: string,
  secret: string,
  chat_id: number,
  new_member_username: string
) => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/people/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  const data = {
    username: new_member_username,
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.status === 201) {
      console.log(
        `[Chat API] POST: new member ${new_member_username} added to chat ${chat_id}`
      );
      return true;
    }
    console.error(`[Chat API] POST: AddChatMember() error: ${response.data}`);
    return false;
  } catch (err) {
    console.error(`[Chat API] POST: AddChatMember() ERROR: ${err}`);
    return false;
  }
};

export const RemoveChatMember = async (
  username: string,
  secret: string,
  chat_id: number,
  target_member_username: string
) => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/people/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  const data = {
    username: target_member_username,
  };

  try {
    const response = await axios.put(url, data, { headers });
    if (response.status === 200) {
      console.log(
        `[Chat API] POST: member ${target_member_username} removed from chat ${chat_id}`
      );
      return true;
    }
    console.error(
      `[Chat API] POST: RemoveChatMember() error: ${response.data}`
    );
    return false;
  } catch (err) {
    console.error(`[Chat API] POST: RemoveChatMember() ERROR: ${err}`);
    return false;
  }
};

export const UpdateChatDetails = async (
  username: string,
  secret: string,
  chat_id: number,
  new_chat_title: string
) => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  const data = {
    title: new_chat_title,
    is_direct_chat: false,
  };

  try {
    const response = await axios.patch(url, data, { headers });
    if (response.status === 200) {
      console.log(
        `[Chat API] PATCH: member ${username} update info of chat ${chat_id}`
      );
      return true;
    }
    console.error(
      `[Chat API] PATCH: UpdateChatDetails() error: ${response.data}`
    );
    return false;
  } catch (err) {
    console.error(`[Chat API] PATCH: UpdateChatDetails() ERROR: ${err}`);
    return false;
  }
};

export const DeleteChat = async (
  username: string,
  secret: string,
  chat_id: number
) => {
  const url = `${process.env.EXPO_PUBLIC_BASE_URL}/chats/${chat_id}/`;

  const headers = {
    "Project-ID": process.env.EXPO_PUBLIC_PROJECT_ID,
    "User-Name": username,
    "User-Secret": secret,
  };

  try {
    const response = await axios.delete(url, { headers });
    if (response.status === 200) {
      console.log(
        `[Chat API] DELETE: member ${username} update info of chat ${chat_id}`
      );
      return true;
    }
    console.error(`[Chat API] DELETE: DeleteChat() error: ${response.data}`);
    return false;
  } catch (err) {
    console.error(`[Chat API] DELETE: DeleteChat() ERROR: ${err}`);
    return false;
  }
};
