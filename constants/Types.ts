import { SQLiteDatabase } from "expo-sqlite";

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
  user_id: string;
  user_name: string;
  last_message?: string;
  last_message_time?: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
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
  avatar_icon?: string;
  icon_color?: string;
  icon_background_color?: string;
  icon_border_color?: string;
  theme_colors?: ThemeColorsProps;
  children?: React.ReactNode;
}

// Avatar Components props
export interface UserAvatarProps {
  icon: string;
  icon_size: number;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
  theme_colors?: ThemeColorsProps;
}

export interface MessagesProps {
  id: number;
  content: string;
  sender_id: string;
  receiver_id: string;
  content_type: string;
  timestamp: string;
}

export interface MessagesDateabseProps {
  content: string;
  sender_id: string;
  receiver_id: string;
  content_type: string;
  is_recevied: boolean;
  db: SQLiteDatabase;
}

export interface UserProps {
  id: string;
  name: string;
}

export interface AuthenticationContentProps {
  user: UserProps | null;
  isLoading: boolean;
  error: string;
}

export interface FriendProps {
  id: string;
  name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
  last_message_content: string;
  last_message_timestamp: string;
}

export interface FriendsContextProps {
  friends: FriendProps[];
  setFriends: React.Dispatch<React.SetStateAction<FriendProps[]>>;
  getFriendById: (id: string) => FriendProps | undefined;
  updateFriendById: (id: string) => void;
  deleteFriendById: (id: string) => void;
  addFriend: (
    id: string,
    name: string,
    avatar_icon: string,
    icon_color: string,
    icon_background_color: string,
    icon_border_color: string
  ) => void;
}

export interface InputBarProps {
  friend_id: string;
  friend_name: string;
  avatar_icon: string;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
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
