import React from "react";
import { useTheme } from "@react-navigation/native";
import { BubbleContent, BubbleConatiner, Bubble } from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";

export default function MessageBubble({
  isReceived = false,
  message_content,
}: {
  isReceived?: boolean;
  message_content: string;
}) {
  const { colors } = useTheme();
  return (
    <BubbleConatiner isReceived={isReceived}>
      <Bubble isReceived={isReceived} theme_colors={colors}>
        <BubbleContent>{message_content}</BubbleContent>
      </Bubble>

      <BubbleAvatar
        icon="alien"
        icon_size={40}
        icon_color={colors.text}
        theme_colors={colors}
      />
    </BubbleConatiner>
  );
}
