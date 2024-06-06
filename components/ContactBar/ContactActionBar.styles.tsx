import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { ThemeColorsProps } from "@/constants/ComponentTypes";
import { default_theme } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { ProfileBarProps } from "@/constants/ComponentTypes";
import { useTheme } from "styled-components/native";

interface ContactActionBarProps {
  content: string;
  IconComponent: React.ComponentType; // Add this line
  theme_colors: ThemeColorsProps;
}

export const ContactActionBarCard: React.FC<ContactActionBarProps> = styled(
  Card.Title
).attrs<ContactActionBarProps>((props) => {
  return {
    title: props.content,

    titleStyle: {
      fontSize: 17,
      fontWeight: "bold",
      color: props.theme_colors?.text ?? default_theme.TEXT,
      paddingLeft: 30,
    },

    left: () => <props.IconComponent />,
  };
})`
  height: 70px;
  width: 100%;
  background-color: ${(props) =>
    props.theme_colors?.card ?? default_theme.CARD};
  border-color: ${(props) => props.theme_colors?.card ?? default_theme.CARD};
  border-style: solid;
  border-width: 1px;
`;
