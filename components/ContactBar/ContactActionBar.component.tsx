import React from "react";
import { useTheme } from "@react-navigation/native";
import { ThemeColorsProps } from "@/constants/ComponentTypes";
import { ContactActionBarCard } from "./ContactActionBar.styles";

interface ContactActionBarProps {
  content: string;
  IconComponent: React.ComponentType; // Add this line
  theme_colors: ThemeColorsProps;
}

const ContactActionBar = (props: ContactActionBarProps) => {
  //const { colors } = useTheme();

  return (
    <ContactActionBarCard
      content={props.content}
      IconComponent={props.IconComponent}
      theme_colors={props.theme_colors}
    />
  );
};

export default ContactActionBar;
