import React, { useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { ChatBoxProps } from "@/constants/Types";
import { ProfileBarCard } from "./ProfileBar.styles";

const ProfileBar = (props: ChatBoxProps) => {
  const { colors } = useTheme();

  return (
    <ProfileBarCard
      user_id={props.user_id}
      user_name={props.user_name}
      avatar_icon={props.avatar_icon}
      icon_background_color={props.icon_background_color}
      theme_colors={colors}
    />
  );
};

export default ProfileBar;
