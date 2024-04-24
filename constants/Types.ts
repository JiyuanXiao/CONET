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
  user_name: string;
  last_message: string;
  last_message_time: string;
  avatar_icon?: string;
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
