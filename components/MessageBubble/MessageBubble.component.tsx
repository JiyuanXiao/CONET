import React, { useContext } from "react";
import { View } from "react-native";
import {
  BubbleContent,
  BubbleConatiner,
  Bubble,
  BubbleTime,
} from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessageBubbleProps } from "@/constants/Types";
import { AuthenticationContext } from "@/api/authentication/authentication.context";

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const elapsed_time = now - timestamp * 1000; // Convert to milliseconds

  if (elapsed_time < 365 * 24 * 60 * 60 * 1000) {
    // Less than one year
    return new Date(timestamp * 1000).toLocaleString([], {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // More than a year
    return new Date(timestamp * 1000).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

const MessageBubble = (props: MessageBubbleProps) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);

  const lastMessageTime = formatTimestamp(Number(props.timestamp));

  return (
    <BubbleConatiner isReceived={props.isReceived} theme_colors={colors}>
      <View>
        <Bubble isReceived={props.isReceived} theme_colors={colors}>
          <BubbleContent isReceived={props.isReceived} theme_colors={colors}>
            {props.message_content}
          </BubbleContent>
        </Bubble>
        <BubbleTime theme_colors={colors}>{lastMessageTime}</BubbleTime>
      </View>
      <BubbleAvatar
        icon={
          props.isReceived
            ? props.avatar_icon ?? "alien"
            : user?.avatar_icon ?? "alien"
        }
        icon_size={40}
        icon_background_color={
          props.isReceived
            ? props.icon_background_color ?? colors.border
            : user?.icon_background_color ?? colors.border
        }
      />
    </BubbleConatiner>
  );
};

export default MessageBubble;
