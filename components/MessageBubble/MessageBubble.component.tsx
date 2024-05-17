import React from "react";
import { BubbleContent, BubbleConatiner, Bubble } from "./MessageBubble.styles";
import BubbleAvatar from "./BubbleAvatar.component";
import { useTheme } from "@react-navigation/native";
import { MessageBubbleProps } from "@/constants/Types";

const MessageBubble = (props: MessageBubbleProps) => {
  const { colors } = useTheme();
  const my_avator_icon = {
    iocn: "alien",
    icon_color: colors.text,
    icon_background_color: colors.border,
    icon_border_color: colors.text,
  };
  return (
    <BubbleConatiner isReceived={props.isReceived} theme_colors={colors}>
      <Bubble isReceived={props.isReceived} theme_colors={colors}>
        <BubbleContent isReceived={props.isReceived} theme_colors={colors}>
          {props.message_content}
        </BubbleContent>
      </Bubble>

      <BubbleAvatar
        icon={
          props.isReceived ? props.avatar_icon ?? "alien" : my_avator_icon.iocn
        }
        icon_size={40}
        icon_color={
          props.isReceived
            ? props.icon_color ?? colors.text
            : my_avator_icon.icon_color
        }
        icon_background_color={
          props.isReceived
            ? props.icon_background_color ?? colors.border
            : my_avator_icon.icon_background_color
        }
        icon_border_color={
          props.isReceived
            ? props.icon_border_color ?? colors.text
            : my_avator_icon.icon_border_color
        }
      />
    </BubbleConatiner>
  );
};

export default MessageBubble;
