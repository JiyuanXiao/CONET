import React from "react";
import { BubbleContent, BubbleConatiner, Bubble } from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";

interface MessageBubbleProps {
  isReceived?: boolean;
  message_content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  isReceived = false,
  message_content,
}) => {
  const { colors } = useTheme();
  return (
    <BubbleConatiner isReceived={isReceived}>
      <Bubble isReceived={isReceived} theme_colors={colors}>
        <BubbleContent>{message_content}</BubbleContent>
      </Bubble>

      <BubbleAvatar icon="alien" icon_size={40} icon_color="white" />
    </BubbleConatiner>
  );
};

export default MessageBubble;
