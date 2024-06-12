import React from "react";
import { ProfileAvatarImage } from "./ProfileAvatar.styles";
import { useTheme } from "@react-navigation/native";
import { UserAvatarProps } from "@/constants/ComponentTypes";
import GroupAvatar from "@/components/ProfileAvatar/GroupAvatar.component";

const ProfileAvatar = (props: UserAvatarProps) => {
  const { colors } = useTheme();

  return (
    <ProfileAvatarImage
      img_src={props.img_src}
      size={props.size}
      theme_colors={colors}
    />
  );
};

export default ProfileAvatar;
