import React from "react";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar.component";
import { BubbleAvatarContainer } from "./BubbleAvatar.styles";
import { UserAvatarProps } from "@/constants/Types";

const BubbleAvatar = (props: UserAvatarProps) => {
  return (
    <BubbleAvatarContainer>
      <ProfileAvatar
        icon={props.icon}
        icon_size={props.icon_size}
        icon_color={props.icon_color}
        icon_background_color={props.icon_background_color}
        icon_border_color={props.icon_border_color}
      />
    </BubbleAvatarContainer>
  );
};

export default BubbleAvatar;
