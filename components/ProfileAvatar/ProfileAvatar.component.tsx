import React from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { ProfileAvatarIcon } from "./ProfileAvatar.styles";
import { useTheme } from "@react-navigation/native";

const ProfileAvatar = () => {
  const { colors } = useTheme();
  return (
    <ProfileAvatarIcon
      icon_size={55}
      icon="alien"
      icon_color={colors.text}
      theme_colors={colors}
    />
  );
};

export default ProfileAvatar;
