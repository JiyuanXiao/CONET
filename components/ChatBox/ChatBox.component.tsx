import React from "react";
import { Text } from "@/components/Themed";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxCard } from "./ChatBox.styles";
import { useTheme } from "@react-navigation/native";

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
        <ProfileAvatar icon="alien" icon_size={55} icon_color="white" />
      )}
      last_message_time={() => <Text>{props.last_msg_time}</Text>}
    />
  );
};

export default ChatBox;
