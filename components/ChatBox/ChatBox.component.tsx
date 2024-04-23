import React from "react";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxCard } from "./ChatBox.styles";
import { useTheme } from "@react-navigation/native";
import { LastMsgTime } from "./ChatBox.styles";

interface ChatBoxProps {
  name: string;
  last_msg: string;
  last_msg_time: string;
}

const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const { colors } = useTheme();
  return (
    <ChatBoxCard
      user_name={props.name}
      last_message={props.last_msg}
      theme_colors={colors}
      avatar={() => (
        <ProfileAvatar
          icon="alien"
          icon_size={55}
          icon_color={colors.primary}
          icon_background_color={colors.border}
          icon_border_color={colors.primary}
        />
      )}
      last_message_time={() => (
        <LastMsgTime theme_colors={colors}>{props.last_msg_time}</LastMsgTime>
      )}
    />
  );
};

export default ChatBox;
