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
        icon_background_color={props.icon_background_color}
      />
    </BubbleAvatarContainer>
  );
};

export default BubbleAvatar;
