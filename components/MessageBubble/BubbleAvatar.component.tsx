import React from "react";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar.component";
import { BubbleAvatarContainer } from "./BubbleAvatar.styles";
import { UserAvatarProps } from "@/constants/ComponentTypes";

const BubbleAvatar = (props: UserAvatarProps) => {
  return (
    <BubbleAvatarContainer>
      <ProfileAvatar img_src={props.img_src} size={props.size} />
    </BubbleAvatarContainer>
  );
};

export default BubbleAvatar;
