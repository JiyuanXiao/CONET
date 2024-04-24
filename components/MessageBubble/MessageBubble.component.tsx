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
        icon="alien"
        icon_size={40}
        icon_color={colors.text}
        icon_background_color={colors.border}
        icon_border_color={colors.text}
      />
    </BubbleConatiner>
  );
};

export default MessageBubble;
