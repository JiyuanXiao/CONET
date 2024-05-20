import React, { useContext } from "react";
import { BubbleContent, BubbleConatiner, Bubble } from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessageBubbleProps } from "@/constants/Types";
import { AuthenticationContext } from "@/api/authentication/authentication.context";

const MessageBubble = (props: MessageBubbleProps) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticationContext);

  return (
    <BubbleConatiner isReceived={props.isReceived} theme_colors={colors}>
      <Bubble isReceived={props.isReceived} theme_colors={colors}>
        <BubbleContent isReceived={props.isReceived} theme_colors={colors}>
          {props.message_content}
        </BubbleContent>
      </Bubble>

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
