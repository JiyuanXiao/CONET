import { SQLiteDatabase } from "expo-sqlite";
import { CE_UserProps, CE_ChatProps } from "./ChatEngineObjectTypes";

// Theme props
export interface ThemeColorsProps {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

// ChatBox Components props
export interface ChatBoxProps {
  chat_id: number;
  chat_title: string;
  last_message: string;
  last_message_time: string;
  avatar_img_src: string;
  is_direct_chat?: boolean;
  has_new_message: boolean;
  theme_colors?: ThemeColorsProps;
}

// TextInput Components props
export interface TextInputBarProps {
  inputHeight: number;
  theme_colors: ThemeColorsProps;
  value?: string | undefined;
  onChangeText?: (text: string) => void;
  onContentSizeChange?: (event: any) => void;
  children?: React.ReactNode;
}

//MessageBubble Components props
export interface MessageBubbleProps {
  isReceived: boolean;
  message_content?: string;
  avatar_img_src?: string;
  theme_colors?: ThemeColorsProps;
  timestamp?: string;
  children?: React.ReactNode;
}

// Avatar Components props
export interface UserAvatarProps {
  img_src: string;
  size: number;
  is_direct_chat?: boolean;
  theme_colors?: ThemeColorsProps;
}

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

export interface UserProps {
  account_id: string;
  name: string;
  avatar_img_src: string;
}

export interface AuthenticationContentProps {
  user: CE_UserProps | null;
  isLoading: boolean;
  error: string;
  is_authentication_initialized: boolean;
  logIn: (id: string, pw: string) => Promise<boolean>;
  logOut: () => Promise<void>;
}

export interface ChatProps {
  chat_id: number;
  chat_name: string;
  avatar_img_src: string;
  last_message: string;
  last_message_timestamp: string;
}

export interface ChatsContextProps {
  chats: CE_ChatProps[];
  setChats: React.Dispatch<React.SetStateAction<CE_ChatProps[]>>;
  current_talking_chat_id: number;
  setCurrentTalkingChatId: React.Dispatch<React.SetStateAction<number>>;
  is_chats_initialized: boolean;
  addChat: (chat_object: CE_ChatProps) => void;
  updateChat: (chat_object: CE_ChatProps) => void;
  deleteChat: (chat_id: number) => void;
  has_new_message: Map<number, boolean>;
  setHasNewMessageStatus: (chat_id: number, read_status: boolean) => void;
}

export interface InputBarProps {
  chat_id: number;
  setMessageSent: React.Dispatch<React.SetStateAction<boolean>>;
}

// OptionCard Components props
export interface OptionBarProps {
  content: string;
  align_self?: string;
  theme_colors?: ThemeColorsProps;
}

export type ConfirmDialogProps = {
  visible: boolean;
  confirm_message: string;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ProfileBarProps {
  contact_id?: number;
  contact_alias: string;
  contact_username?: string;
  avatar_img_src: string;
  theme_colors?: ThemeColorsProps;
}
