import React from "react";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar.component";
import { BubbleAvatarContainer } from "./BubbleAvatar.styles";

interface ProfileAvatarProps {
  icon: string;
  icon_size: number;
  icon_color: string;
  theme_colors:
    | {
        primary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
      }
    | undefined;
}

const BubbleAvatar: React.FC<ProfileAvatarProps> = (props) => {
  return (
    <BubbleAvatarContainer>
      <ProfileAvatar
        icon={props.icon}
        icon_size={props.icon_size}
        icon_color={props.icon_color}
        theme_colors={props.theme_colors}
      />
    </BubbleAvatarContainer>
  );
};

export default BubbleAvatar;
