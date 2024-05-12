import React, { useContext, useEffect, useState } from "react";
import { ChatBoxCard } from "./ChatBox.styles";
import { useTheme } from "@react-navigation/native";
import { ChatBoxProps } from "@/constants/Types";
import { ChatsContext } from "@/api/chats/chats.context";
import { ChatProps } from "@/constants/Types";

const ChatBox = (props: ChatBoxProps) => {
  const { colors } = useTheme();
  const { chats, getChatById } = useContext(ChatsContext);
  const [chat, setChat] = useState<ChatProps | undefined>();

  // Get the chat's last message and timestamp whenever the chats context is modified
  useEffect(() => {
    const curr_chat = getChatById(props.user_id);
    setChat(curr_chat);
  }, [chats]);

  return (
    <ChatBoxCard
      user_id={props.user_id}
      user_name={props.user_name}
      last_message={chat?.last_message_content}
      last_message_time={chat?.last_message_timestamp}
      theme_colors={colors}
      avatar_icon="alien"
    />
  );
};

export default ChatBox;
