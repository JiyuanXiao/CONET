import React from "react";
import { ChatBoxCard } from "./ChatBox.styles";
import { useTheme } from "@react-navigation/native";
import { ChatBoxProps } from "@/constants/Types";

const ChatBox = (props: ChatBoxProps) => {
  const { colors } = useTheme();
  return (
    <ChatBoxCard
      user_name={props.user_name}
      last_message={props.last_message}
      last_message_time={props.last_message_time}
      theme_colors={colors}
      avatar_icon="alien"
    />
  );
};

export default ChatBox;
