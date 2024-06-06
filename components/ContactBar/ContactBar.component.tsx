import React from "react";
import { useTheme } from "@react-navigation/native";
import { ProfileBarProps } from "@/constants/ComponentTypes";
import { ContactBarCard } from "./ContactBar.styles";

const ContactBar = (props: ProfileBarProps) => {
  const { colors } = useTheme();

  return (
    <ContactBarCard
      contact_alias={props.contact_alias}
      avatar_img_src={props.avatar_img_src}
      theme_colors={colors}
    />
  );
};

export default ContactBar;
