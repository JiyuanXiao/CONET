import {
  CE_ChatProps,
  CE_MessageProps,
} from "@/constants/ChatEngineObjectTypes";

export const CreateChat = (
  username: string,
  secret: string,
  chat_title: string
) => {};

export const GetMyChats = (
  username: string,
  secret: string
): CE_ChatProps[] => {
  const MOCK_CHATS = require("@/mock_data/chats.mock.json");
  const target_chats = MOCK_CHATS.filter((chat: CE_ChatProps) =>
    chat.people.some((person) => person.person.username === username)
  );
  return target_chats;
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

export const SendChatMessage = (
  username: string,
  secret: string,
  chat_id: number,
  text: string | null,
  file: string | null,
  temp_timestamp: string
) => {};

export const GetChatMessages = (
  username: string,
  secret: string,
  chat_id: number
): CE_MessageProps[] => {
  if (chat_id.toString() === "253921") {
    return require("@/mock_data/messages-253921.mock.json");
  }
  if (chat_id.toString() === "254343") {
    return require("@/mock_data/messages-254343.mock.json");
  }
  if (chat_id.toString() === "255451") {
    return require("@/mock_data/messages-255451.mock.json");
  }
  return [];
};

export const GetLatestChatMessages = (
  username: string,
  secret: string,
  chat_id: number,
  chat_count: number
): CE_MessageProps[] => {
  return [];
};

export const GetUnreadChatMessages = (
  username: string,
  secret: string,
  chat_id: number,
  chat_count: number,
  last_read_message_id: number
): CE_MessageProps[] => {
  return [];
};
