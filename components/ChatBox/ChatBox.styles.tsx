import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { Text } from "react-native";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";

export const ChatBoxCard: React.FC<ChatBoxProps> = styled(
  Card.Title
).attrs<ChatBoxProps>((props) => ({
  title: props.user_name,
  subtitle: props.last_message,
  titleStyle: {
    fontSize: 17,
    fontWeight: "bold",
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 10,
  },
  subtitleStyle: {
    fontSize: 13,
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 10,
  },
  left: () => (
    <ProfileAvatar
      icon={props.avatar_icon ?? "alien"}
      icon_size={55}
      icon_color={
        props.icon_color ?? props.theme_colors?.text ?? default_theme.TEXT
      }
      icon_background_color={
        props.icon_background_color ??
        props.theme_colors?.border ??
        default_theme.BORDER
      }
      icon_border_color={
        props.icon_border_color ??
        props.theme_colors?.text ??
        default_theme.TEXT
      }
    />
  ),
  right: () => (
    <Text style={{ color: props.theme_colors?.text ?? default_theme.TEXT }}>
      {props.last_message_time}
    </Text>
  ),
}))`
  height: 80px;
  padding-right: 16px;
  width: 98%;
  background-color: ${(props) =>
    props.theme_colors?.card ?? default_theme.CARD};
  border-color: ${(props) => props.theme_colors?.card ?? default_theme.CARD};
  border-style: solid;
  border-width: 2px;
  border-radius: 20px;
  margin-top: 13px;
`;
