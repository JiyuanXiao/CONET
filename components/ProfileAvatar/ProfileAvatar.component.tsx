import React from "react";
import { ProfileAvatarIcon } from "./ProfileAvatar.styles";
import { useTheme } from "@react-navigation/native";

interface ProfileAvatarProps {
  icon: string;
  icon_size: number;
  icon_color: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
  const { colors } = useTheme();
  return (
    <ProfileAvatarIcon
      icon={props.icon}
      icon_size={props.icon_size}
      icon_color={props.icon_color}
      theme_colors={colors}
    />
  );
};

export default ProfileAvatar;
