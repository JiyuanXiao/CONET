import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import {
  BubbleContent,
  BubbleConatiner,
  Bubble,
  BubbleTime,
} from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessageBubbleProps, MessagesProps } from "@/constants/Types";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { ChatsContext } from "@/api/chats/chats.context";
import { CE_ChatMemberProps } from "@/constants/ChatEngineObjectTypes";

const formatTimestamp = (utc_timestamp: string) => {
  const dateObj = new Date(utc_timestamp);
  const now = new Date();
  const elapsed_time = now.getTime() - dateObj.getTime();

  if (elapsed_time < 365 * 24 * 60 * 60 * 1000) {
    // Less than one year
    return dateObj.toLocaleString([], {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // More than a year
    return dateObj.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

const MessageBubble = ({
  chat_id,
  message_object,
}: {
  chat_id: number;
  message_object: MessagesProps;
}) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  const { chats } = useContext(ChatsContext);
  const [current_chat_member, setCurrentChatMembers] =
    useState<CE_ChatMemberProps>();

  const is_received = user?.username !== message_object.sender_username;
  const lastMessageTime = formatTimestamp(message_object.timestamp);

  useEffect(() => {
    const current_chat = chats.find(
      (chat) => chat.id.toString() === chat_id.toString()
    );
    if (!current_chat) {
      console.error(
        `at MessageBubble() in MessageBubble.component.tsx: chat ${chat_id} is not in chat context`
      );
    }

    const target_chat_member = current_chat?.people.find(
      (chat_member) =>
        chat_member.person.username === message_object.sender_username
    );
    if (target_chat_member) {
      setCurrentChatMembers(target_chat_member);
    } else {
      console.error(
        `at MessageBubble() in MessageBubble.component.tsx: chat member ${message_object.sender_username} is not in chat context`
      );
    }
  }, []);

  return (
    <BubbleConatiner isReceived={is_received} theme_colors={colors}>
      <View>
        <Bubble isReceived={is_received} theme_colors={colors}>
          <BubbleContent isReceived={is_received} theme_colors={colors}>
            {message_object.text_content}
          </BubbleContent>
        </Bubble>
        <BubbleTime theme_colors={colors}>{lastMessageTime}</BubbleTime>
      </View>
      <BubbleAvatar
        img_src={
          current_chat_member?.person.avatar ||
          "../../assets/avatars/avatar_1.png"
        }
        size={40}
      />
    </BubbleConatiner>
  );
};

export default MessageBubble;
