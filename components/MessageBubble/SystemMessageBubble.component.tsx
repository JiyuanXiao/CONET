import React, { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import {
  BubbleContent,
  BubbleConatiner,
  Bubble,
} from "./SystemMessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessagesProps } from "@/constants/ContextTypes";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatMemberProps } from "@/constants/ChatEngineObjectTypes";
import { ActivityIndicator } from "react-native-paper";

const SystemMessageBubble = ({
  chat_id,
  chat_member,
  message_object,
}: {
  chat_id: number;
  chat_member: CE_ChatMemberProps | undefined;
  message_object: MessagesProps;
}) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);

  const is_received = user?.username !== message_object.sender_username;
  const projectID = process.env.EXPO_PUBLIC_PROJECT_ID;

  return chat_member ? (
    <BubbleConatiner isReceived={is_received} theme_colors={colors}>
      <View>
        <Bubble isReceived={is_received} theme_colors={colors}>
          <BubbleContent isReceived={is_received} theme_colors={colors}>
            {message_object.text_content.replace(
              new RegExp(`^\\[${projectID}\\]\\[系统消息\\]`),
              ""
            )}
          </BubbleContent>
        </Bubble>
      </View>
    </BubbleConatiner>
  ) : (
    <></>
  );
};

export default SystemMessageBubble;
