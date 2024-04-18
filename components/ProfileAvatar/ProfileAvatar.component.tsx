import React from "react";
import { ProfileAvatarIcon } from "./ProfileAvatar.styles";

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

const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
  return (
    <ProfileAvatarIcon
      icon={props.icon}
      icon_size={props.icon_size}
      icon_color={props.icon_color}
      theme_colors={props.theme_colors}
    />
  );
};

export default ProfileAvatar;
