import React from "react";
import { ProfileAvatarIcon } from "./ProfileAvatar.styles";
import { useTheme } from "@react-navigation/native";
import { UserAvatarProps } from "@/constants/Types";

const ProfileAvatar = (props: UserAvatarProps) => {
  const { colors } = useTheme();
  return (
    <ProfileAvatarIcon
      icon={props.icon}
      icon_size={props.icon_size}
      icon_color={props.icon_color}
      icon_background_color={props.icon_background_color}
      icon_border_color={props.icon_border_color}
      theme_colors={colors}
    />
  );
};

export default ProfileAvatar;
