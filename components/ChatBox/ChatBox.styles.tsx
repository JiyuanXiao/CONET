import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { Text } from "react-native";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxProps } from "@/constants/Types";
import { PRIMARY_COLOR } from "@/constants/Colors";

export const ChatBoxCard: React.FC<ChatBoxProps> = styled(
  Card.Title
).attrs<ChatBoxProps>((props) => ({
  title: props.user_name,
  subtitle: props.last_message,
  titleStyle: {
    fontSize: 17,
    fontWeight: "bold",
    color: props.theme_colors?.text,
    paddingLeft: 10,
  },
  subtitleStyle: {
    fontSize: 13,
    color: props.theme_colors?.text,
    paddingLeft: 10,
  },
  left: () => (
    <ProfileAvatar
      icon={props.avatar_icon ?? "alien"}
      icon_size={55}
      icon_color={props.theme_colors?.primary ?? PRIMARY_COLOR}
      icon_background_color={props.theme_colors?.border ?? "white"}
      icon_border_color={props.theme_colors?.primary ?? PRIMARY_COLOR}
    />
  ),
  right: () => (
    <Text style={{ color: props.theme_colors?.text }}>
      {props.last_message_time}
    </Text>
  ),
}))`
  height: 80px;
  padding-right: 16px;
  width: 98%;
  background-color: ${(props) => props.theme_colors?.card};
  border-color: ${(props) => props.theme_colors?.card};
  border-style: solid;
  border-width: 2px;
  border-radius: 20px;
  margin-top: 13px;
`;
