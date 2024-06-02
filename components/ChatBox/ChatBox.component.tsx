import React, { useContext, useEffect, useState } from "react";
import { ChatBoxCard } from "./ChatBox.styles";
import { useTheme } from "@react-navigation/native";
import { ChatBoxProps } from "@/constants/ComponentTypes";
import { ChatsContext } from "@/api/chats/chats.context";

import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";

const formatTimestamp = (utc_timestamp: string) => {
  if (utc_timestamp.length === 0) {
    return "";
  }
  const dateObj = new Date(utc_timestamp);
  const now = new Date();
  const elapsed_time = now.getTime() - dateObj.getTime();

  if (elapsed_time < 24 * 60 * 60 * 1000) {
    // Less than 24 hours
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (elapsed_time < 365 * 24 * 60 * 60 * 1000) {
    // Less than one year
    return dateObj.toLocaleString([], {
      month: "short",
      day: "numeric",
    });
  } else {
    // More than a year
    return dateObj.toLocaleString([], {
      year: "numeric",
      month: "short",
    });
  }
};

const ChatBox = (props: ChatBoxProps) => {
  const { colors } = useTheme();
  const { chats, current_talking_chat_id } = useContext(ChatsContext);
  const { user } = useContext(AuthenticationContext);
  const [_, forceUpdate] = useState<number>();

  // Get the chat's last message and timestamp whenever the chats context is modified
  useEffect(() => {
    if (current_talking_chat_id.toString() === props.chat_id.toString()) {
      forceUpdate(Math.random());
    }
  }, [chats, current_talking_chat_id]);

  const lastMessageTime = formatTimestamp(props.last_message_time);

  return (
    <ChatBoxCard
      chat_id={props.chat_id}
      chat_title={props.chat_title}
      last_message={props.last_message}
      last_message_time={lastMessageTime}
      avatar_img_src={props.avatar_img_src}
      is_direct_chat={props.is_direct_chat}
      has_new_message={props.has_new_message}
      theme_colors={colors}
    />
  );
};

export default ChatBox;
