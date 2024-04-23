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
    <BubbleConatiner isReceived={isReceived} theme_colors={colors}>
      <Bubble isReceived={isReceived} theme_colors={colors}>
        <BubbleContent isReceived={isReceived} theme_colors={colors}>
          {message_content}
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
