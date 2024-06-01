import React from "react";
import { ProfileAvatarIcon } from "./ProfileAvatar.styles";
import { useTheme } from "@react-navigation/native";
import { UserAvatarProps } from "@/constants/ComponentTypes";

const ProfileAvatar = (props: UserAvatarProps) => {
  const { colors } = useTheme();
  return (
    <ProfileAvatarIcon
      img_src={props.img_src}
      size={props.size}
      theme_colors={colors}
      is_direct_chat={props.is_direct_chat}
    />
  );
};

export default ProfileAvatar;
