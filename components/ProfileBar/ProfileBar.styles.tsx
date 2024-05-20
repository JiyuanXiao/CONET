import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";

export const ProfileBarCard: React.FC<ChatBoxProps> = styled(
  Card.Title
).attrs<ChatBoxProps>((props) => ({
  title: props.user_name,
  subtitle: "ID: " + props.user_id,
  titleStyle: {
    fontSize: 17,
    fontWeight: "bold",
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 30,
  },
  subtitleStyle: {
    fontSize: 13,
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 30,
  },
  left: () => (
    <ProfileAvatar
      icon={props.avatar_icon}
      icon_size={65}
      icon_background_color={props.icon_background_color}
    />
  ),
}))`
  height: 120px;
  width: 100%;
  background-color: ${(props) =>
    props.theme_colors?.card ?? default_theme.CARD};
  border-color: ${(props) => props.theme_colors?.card ?? default_theme.CARD};
  border-style: solid;
  border-width: 2px;
  margin-bottom: 12px;
`;
