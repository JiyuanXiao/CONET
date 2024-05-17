import React from "react";
import { BubbleContent, BubbleConatiner, Bubble } from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessageBubbleProps } from "@/constants/Types";

const MessageBubble = (props: MessageBubbleProps) => {
  const { colors } = useTheme();
  return (
    <BubbleConatiner isReceived={props.isReceived} theme_colors={colors}>
      <Bubble isReceived={props.isReceived} theme_colors={colors}>
        <BubbleContent isReceived={props.isReceived} theme_colors={colors}>
          {props.message_content}
        </BubbleContent>
      </Bubble>

      <BubbleAvatar
        icon={props.avatar_icon ?? "alien"}
        icon_size={40}
        icon_color={props.icon_color}
        icon_background_color={props.icon_background_color}
        icon_border_color={props.icon_border_color}
      />
    </BubbleConatiner>
  );
};

export default MessageBubble;
