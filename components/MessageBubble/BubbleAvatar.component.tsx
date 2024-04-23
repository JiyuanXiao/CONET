import React from "react";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar.component";
import { BubbleAvatarContainer } from "./BubbleAvatar.styles";
import { ThemeColorsProps } from "@/constants/Types";

interface ProfileAvatarProps {
  icon: string;
  icon_size: number;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
  theme_colors?: ThemeColorsProps;
}

const BubbleAvatar: React.FC<ProfileAvatarProps> = (props) => {
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
