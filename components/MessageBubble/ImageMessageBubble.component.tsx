import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import {
  BubbleImageContent,
  BubbleConatiner,
  Bubble,
  BubbleTime,
  BubbleAlias,
} from "./ImageMessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessagesProps } from "@/constants/ContextTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatMemberProps } from "@/constants/ChatEngineObjectTypes";
import { ActivityIndicator } from "react-native-paper";
import ImageView from "react-native-image-viewing";

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

const ImageMessageBubble = ({
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

  const is_received = user?.username !== message_object.sender_username;
  const lastMessageTime = formatTimestamp(message_object.timestamp);
  const text_header = process.env.EXPO_PUBLIC_SPECIAL_MESSAGE_INDICATOR;
  const [image_uri, setImageUri] = useState("");
  const [image_viewer_visiable, setImageViewerVisiable] = useState(false);

  const HandleViewImage = () => {
    const uri = message_object.text_content.replace(
      new RegExp(`^\\[${text_header}\\]\\[图片\\]`),
      ""
    );
    setImageUri(uri);
    setImageViewerVisiable(true);
  };

  return chat_member ? (
    <>
      <ImageView
        images={[{ uri: image_uri }]}
        imageIndex={0}
        visible={image_viewer_visiable && image_uri.length > 0}
        onRequestClose={() => {
          setImageViewerVisiable(false);
          setImageUri("");
        }}
      />
      <BubbleConatiner isReceived={is_received} theme_colors={colors}>
        <TouchableOpacity onPress={HandleViewImage}>
          <Bubble isReceived={is_received} theme_colors={colors}>
            <BubbleImageContent
              source={message_object.text_content.replace(
                new RegExp(`^\\[${text_header}\\]\\[图片\\]`),
                ""
              )}
            />
          </Bubble>
          {Number(message_object.message_id) < 0 ? (
            <ActivityIndicator color={colors.primary} size={14} />
          ) : (
            <BubbleTime isReceived={is_received} theme_colors={colors}>
              {lastMessageTime}
            </BubbleTime>
          )}
        </TouchableOpacity>
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
                  avatar: chat_member.person.avatar,
                  source: "chat-window",
                },
              })
            }
          >
            <BubbleAvatar img_src={[chat_member.person.avatar]} size={40} />
          </TouchableOpacity>
        </View>
      </BubbleConatiner>
    </>
  ) : (
    <></>
  );
};

export default ImageMessageBubble;