import { SQLiteDatabase } from "expo-sqlite";
import {
  CE_UserProps,
  CE_ChatProps,
  CE_MessageProps,
} from "./ChatEngineObjectTypes";

/////////////////////////////////////// AUTHENTICATION ACONTEXT ////////////////////////////////////////////////

// export interface UserProps {
//   account_id: string;
//   name: string;
//   avatar_img_src: string;
// }

export interface AuthenticationContentProps {
  user: CE_UserProps | null;
  isLoading: boolean;
  error: string;
  is_authentication_initialized: boolean;
  logIn: (id: string, pw: string) => Promise<boolean>;
  logOut: () => Promise<void>;
}

/////////////////////////////////////// MESSAGE CONTEXT ////////////////////////////////////////////////

export interface MessagesDateabseProps {
  message_id: number;
  sender_username: string;
  text_content: string;
  file_url: string;
  content_type: string;
  timestamp: string;
  db: SQLiteDatabase;
}

export interface MessagesProps {
  message_id: number;
  sender_username: string;
  text_content: string;
  file_url: string;
  content_type: string;
  timestamp: string;
}

export interface MessageContextObjectProps {
  chat_id: number;
  loaded_messages: MessagesProps[];
  current_index: number; // THis is the first unloaded messages index
  total_messages_amount: number;
}

export interface MessageContextProps {
  messages: Map<number, MessageContextObjectProps>;
  loadMessagesById: (chat_id: number) => Promise<void>;
  sendMessage: (
    chat_id: number,
    username: string,
    text_content: string | null,
    file_url: string | null,
    timestamp: string
  ) => void;
  receiveMessage: (
    username: string,
    chat_id: number,
    ce_message: CE_MessageProps
  ) => boolean;
  resetLoadedMessagesById: (chat_id: number) => Promise<void>;
  ClearAllMessagesById: (chat_id: number) => Promise<void>;
  is_messages_initialized: boolean;
}

/////////////////////////////////////// CHAT CONTEXT ////////////////////////////////////////////////

export interface ChatProps {
  chat_id: number;
  chat_name: string;
  avatar_img_src: string;
  last_message: string;
  last_message_timestamp: string;
}

export interface ChatsContextProps {
  chats: Map<number, CE_ChatProps>;
  setChatMap: (chat_id: number, chat: CE_ChatProps) => void;
  current_talking_chat_id: number;
  setCurrentTalkingChatId: React.Dispatch<React.SetStateAction<number>>;
  has_new_message: Map<number, boolean>;
  setHasNewMessageStatus: (chat_id: number, read_status: boolean) => void;
  is_chats_initialized: boolean;
  addChat: (chat_object: CE_ChatProps) => Promise<void>;
  updateChat: (chat_object: CE_ChatProps) => Promise<void>;
  deleteChat: (chat_id: number) => Promise<void>;
  getLastRead: (chat_id: number) => Promise<number>;
  setLastRead: (chat_id: number, last_read_message_id: number) => Promise<void>;
}
