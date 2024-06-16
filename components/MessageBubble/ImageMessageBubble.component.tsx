import React, { useContext, useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import { TouchableOpacity, View, Alert } from "react-native";
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
import * as MediaLibrary from "expo-media-library";
import { getAvatarAssets } from "@/constants/Avatars";

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
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const avatars = getAvatarAssets();

  const HandleViewImage = () => {
    const uri = message_object.text_content.replace(
      new RegExp(`^\\[${text_header}\\]\\[图片\\]`),
      ""
    );
    setImageUri(uri);
    setImageViewerVisiable(true);
  };

  const savePhoto = useCallback(async (uri: string) => {
    let current_permission = permissionResponse;
    if (!current_permission || current_permission.status !== "granted") {
      current_permission = await requestPermission();
      console.log(current_permission);
    }

    if (current_permission?.status !== "granted") {
      Alert.alert("未成功授权访问相册");
      return;
    }

    Alert.alert("确认保存图片?", "", [
      {
        isPreferred: true,
        text: "确认",
        onPress: async () => {
          try {
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("保存成功", "", [{ text: "OK", onPress: () => {} }]);
          } catch (err) {
            console.error(
              `[ImageMessageBubble.component] savePhoto: failed to save phto to library: ${err}`
            );
          }
        },
        style: "default",
      },
      {
        isPreferred: false,
        text: "取消",
        onPress: () => {},
        style: "destructive",
      },
    ]);
  }, []);

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
        onLongPress={() => {
          savePhoto(image_uri);
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
    </>
  ) : (
    <></>
  );
};

export default ImageMessageBubble;
