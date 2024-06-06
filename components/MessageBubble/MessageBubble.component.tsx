import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import {
  BubbleContent,
  BubbleConatiner,
  Bubble,
  BubbleTime,
  BubbleAlias,
} from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessagesProps } from "@/constants/ContextTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatMemberProps } from "@/constants/ChatEngineObjectTypes";
import { ActivityIndicator } from "react-native-paper";

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
  chat_member,
  message_object,
  is_direct_chat,
}: {
  chat_id: number;
  chat_member: CE_ChatMemberProps | undefined;
  message_object: MessagesProps;
  is_direct_chat: boolean;
}) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);
  //const {messages} = useContext(MessagesContext);
  //const { current_talking_chat_id } = useContext(ChatsContext);
  // const [current_chat_member, setCurrentChatMembers] =
  //   useState<CE_ChatMemberProps>();

  const is_received = user?.username !== message_object.sender_username;
  const lastMessageTime = formatTimestamp(message_object.timestamp);

  return chat_member ? (
    <BubbleConatiner isReceived={is_received} theme_colors={colors}>
      <View>
        <Bubble isReceived={is_received} theme_colors={colors}>
          <BubbleContent isReceived={is_received} theme_colors={colors}>
            {message_object.text_content}
          </BubbleContent>
        </Bubble>
        {Number(message_object.message_id) < 0 ? (
          <ActivityIndicator color={colors.primary} size={14} />
        ) : (
          <BubbleTime isReceived={is_received} theme_colors={colors}>
            {lastMessageTime}
          </BubbleTime>
        )}
      </View>
      <View style={{ flexDirection: "column", justifyContent: "flex-end" }}>
        {!is_direct_chat && (
          <BubbleAlias isReceived={is_received} theme_colors={colors}>
            {chat_member.person.first_name}
          </BubbleAlias>
        )}
        <BubbleAvatar img_src={[chat_member.person.avatar]} size={40} />
      </View>
    </BubbleConatiner>
  ) : (
    <></>
  );
};

export default MessageBubble;
