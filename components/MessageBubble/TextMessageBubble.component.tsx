import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { TouchableOpacity, View, Alert } from "react-native";
import {
  BubbleContent,
  BubbleConatiner,
  Bubble,
  BubbleTime,
  BubbleAlias,
} from "./TextMessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessagesProps } from "@/constants/ContextTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatMemberProps } from "@/constants/ChatEngineObjectTypes";
import { ActivityIndicator } from "react-native-paper";
import { getAvatarAssets } from "@/constants/Avatars";
import { FontAwesome } from "@expo/vector-icons";
import { MessagesContext } from "@/api/messages/messages.context";
import { SelectableText } from "@rob117/react-native-selectable-text";

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

const TextMessageBubble = ({
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
  const avatars = getAvatarAssets();
  const { sendMessage } = useContext(MessagesContext);
  const is_received = user?.username !== message_object.sender_username;
  const lastMessageTime = formatTimestamp(message_object.timestamp);

  const resendMessage = async () => {
    const message = `${message_object.text_content}`;
    console.log(message);
    await sendMessage(chat_id, message, Date.now().toString());
  };

  const handleFailedMessage = () => {
    Alert.alert("消息发送失败", "", [
      { text: "重新发送", onPress: resendMessage },
      { text: "取消", onPress: () => {} },
    ]);
  };

  return chat_member ? (
    <BubbleConatiner isReceived={is_received} theme_colors={colors}>
      {message_object.message_id < 0 && (
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={handleFailedMessage}
        >
          <FontAwesome
            name="exclamation-circle"
            size={24}
            color={colors.notification}
          />
        </TouchableOpacity>
      )}
      <View>
        <Bubble isReceived={is_received} theme_colors={colors}>
          <BubbleContent
            isReceived={is_received}
            theme_colors={colors}
            value={message_object.text_content}
          />
        </Bubble>
        {Number(message_object.message_id) < 0 ? (
          <></>
        ) : Number(message_object.message_id) === 0 ? (
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
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/contact-detail",
              params: {
                contact_username: chat_member.person.username,
                contact_first_name: chat_member.person.first_name,
                avatar_index: chat_member.person.custom_json,
                source: "chat-window",
              },
            })
          }
        >
          <BubbleAvatar
            img_src={
              avatars ? [avatars[Number(chat_member.person.custom_json)]] : []
            }
            size={40}
          />
        </TouchableOpacity>
      </View>
    </BubbleConatiner>
  ) : (
    <></>
  );
};

export default TextMessageBubble;
