import { SQLiteDatabase } from "expo-sqlite";
import {
  CE_UserProps,
  CE_ChatProps,
  CE_MessageProps,
  CE_PersonProps,
} from "./ChatEngineObjectTypes";
import { Asset } from "expo-asset";

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
  can_hide_splash: boolean;
  logIn: (id: string, pw: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  changePassword: (
    old_password: string,
    new_password: string
  ) => Promise<number>;
  chanegName: (new_name: string) => Promise<number>;
  chanegAvatar: (avatar_index: number) => Promise<number>;
  reloadAccountInfo: () => Promise<void>;
}

export interface MyAccountResponseProps {
  success: boolean;
  status: number;
  data: CE_UserProps | null;
  error: any;
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
  message_draft: Map<number, string>;
  setChatMap: (chat_id: number, chat: CE_ChatProps) => void;
  current_talking_chat_id: number;
  setCurrentTalkingChatId: React.Dispatch<React.SetStateAction<number>>;
  has_new_message: Map<number, boolean>;
  setHasNewMessageStatus: (chat_id: number, read_status: boolean) => void;
  is_chats_initialized: boolean;
  is_chats_loaded_from_local: boolean;
  updateChat: (chat_object: CE_ChatProps) => Promise<void>;
  deleteChat: (chat_id: number) => Promise<void>;
  getLastRead: (chat_id: number) => Promise<number>;
  setLastRead: (chat_id: number, last_read_message_id: number) => Promise<void>;
  fetchChatDataFromServer: (user: CE_UserProps) => Promise<void>;
  resetChatContext: () => void;
  changeChatTitle: (chat_id: number, new_title: string) => Promise<void>;
  setMessageDraftMap: (chat_id: number, draft: string) => void;
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
  createMeesageObjectForNewChat: (chat_id: number) => Promise<void>;
  loadMessagesById: (chat_id: number) => Promise<void>;
  sendMessage: (
    chat_id: number,
    message_content: string,
    temp_timestamp: string
  ) => Promise<boolean>;
  receiveMessage: (
    chat_id: number,
    ce_message: MessagesProps,
    temp_timestamp: string
  ) => boolean;
  resetLoadedMessagesById: (chat_id: number) => Promise<void>;
  ClearAllMessagesById: (chat_id: number) => void;
  is_messages_initialized: boolean;
  is_message_loaded_from_local: boolean;
  initializeMessageContext: () => Promise<void>;
  resetMessageContext: () => void;
}

///////////////////////////////////////// WEBSOCKET //////////////////////////////////////////////

export interface WebsocketContextProps {
  websocket_connected: boolean;
  resetWebSocket: () => void;
  closeWebSocket: () => void;
}

//////////////////////////////////////////// CONTACT //////////////////////////////////////////////

export interface ContactStorageProps {
  id: number;
  contact: CE_PersonProps;
}

export interface ContactContextProps {
  contacts: Map<number, CE_PersonProps>;
  addContact: (contact_id: number, contact: CE_PersonProps) => Promise<void>;
  removeContact: (contact_id: number) => Promise<void>;
  searchContact: (contact_id: number) => Promise<ContactStorageProps | null>;
  uploadContacts: () => Promise<void>;
  resetContacts: () => void;
}
