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
  avatar_img_src: string[];
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

export interface InputBarProps {
  chat_id: number;
  setMessageSent: React.Dispatch<React.SetStateAction<boolean>>;
}

//MessageBubble Components props
export interface MessageBubbleProps {
  isReceived: boolean;
  message_content?: string;
  avatar_img_src?: string[];
  theme_colors?: ThemeColorsProps;
  timestamp?: string;
  onImageResize?: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
  children?: React.ReactNode;
}

// Avatar Components props
export interface UserAvatarProps {
  img_src: string[];
  size: number;
  theme_colors?: ThemeColorsProps;
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
  avatar_img_src: string[];
  theme_colors?: ThemeColorsProps;
  disable?: boolean;
}
