import React from "react";
import { Text } from "@/components/Themed";
import { useTheme } from "@react-navigation/native";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxCard } from "./ChatBox.styles";

interface ChatProps {
  name: string;
  last_msg: string;
  last_msg_time: string;
}

export default function ChatBox({ name, last_msg, last_msg_time }: ChatProps) {
  const { colors } = useTheme();

  return (
    <ChatBoxCard
      user_name={name}
      last_message={last_msg}
      theme_colors={colors}
      avatar={() => (
        <ProfileAvatar
          icon="alien"
          icon_size={55}
          icon_color={colors.text}
          theme_colors={colors}
        />
      )}
      last_message_time={() => <Text>{last_msg_time}</Text>}
    />
  );
}
