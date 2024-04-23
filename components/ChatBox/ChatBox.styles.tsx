import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { Text } from "react-native";
import { ThemeColorsProps } from "@/constants/Types";

interface ChatBoxCardProps {
  user_name: string;
  last_message: string;
  theme_colors: ThemeColorsProps;
  avatar: () => React.JSX.Element;
  last_message_time: () => React.JSX.Element;
}

interface LastMsgTimepProps {
  theme_colors: ThemeColorsProps;
  children: string;
}

export const ChatBoxCard: React.FC<ChatBoxCardProps> = styled(
  Card.Title
).attrs<ChatBoxCardProps>((props) => ({
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
  left: props.avatar,
  right: props.last_message_time,
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

export const LastMsgTime: React.FC<LastMsgTimepProps> = styled(Text)`
  color: ${(props) => props.theme_colors.text};
`;
