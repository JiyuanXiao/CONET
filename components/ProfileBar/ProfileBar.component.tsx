import React from "react";
import { useTheme } from "@react-navigation/native";
import { ProfileBarProps } from "@/constants/ComponentTypes";
import { ProfileBarCard } from "./ProfileBar.styles";

const ProfileBar = (props: ProfileBarProps) => {
  const { colors } = useTheme();

  return (
    <ProfileBarCard
      contact_id={props.contact_id}
      contact_alias={props.contact_alias}
      contact_username={props.contact_username}
      avatar_img_src={props.avatar_img_src}
      theme_colors={colors}
    />
  );
};

export default ProfileBar;
