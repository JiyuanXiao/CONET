import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { default_theme } from "@/constants/Colors";
import { ProfileBarProps } from "@/constants/ComponentTypes";

export const ContactBarCard: React.FC<ProfileBarProps> = styled(
  Card.Title
).attrs<ProfileBarProps>((props) => {
  return {
    title: props.contact_alias,
    titleStyle: {
      fontSize: 15,
      fontWeight: "medium",
      color: props.theme_colors?.text ?? default_theme.TEXT,
      paddingLeft: 10,
    },
    left: () => <ProfileAvatar img_src={props.avatar_img_src} size={40} />,
  };
})`
  height: 70px;
  width: 90%;
  align-self: center;
  background-color: ${(props) =>
    props.theme_colors?.card ?? default_theme.CARD};
  border-color: ${(props) => props.theme_colors?.card ?? default_theme.CARD};
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  margin-top: 10px;
`;
