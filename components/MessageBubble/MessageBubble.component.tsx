import React from "react";
import { useTheme } from "@react-navigation/native";
import {
  BubbleContent,
  BubbleConatiner,
  Bubble,
  ArrowContainer,
  Arrow,
  ArrowCover,
} from "./MessageBubble.styles";

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
      <ArrowContainer>
        <Arrow isReceived={isReceived} theme_colors={colors} />
        <ArrowCover isReceived={isReceived} theme_colors={colors} />
      </ArrowContainer>
    </BubbleConatiner>
  );
}
