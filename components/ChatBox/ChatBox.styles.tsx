import React from "react";
import styled from "styled-components/native";
import { Card, Badge } from "react-native-paper";
import { Text, View } from "react-native";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxProps } from "@/constants/ComponentTypes";
import { default_theme } from "@/constants/Colors";

export const ChatBoxCard: React.FC<ChatBoxProps> = styled(
  Card.Title
).attrs<ChatBoxProps>((props) => ({
  title: props.chat_title,
  subtitle: props.last_message,
  titleStyle: {
    fontSize: 17,
    fontWeight: "bold",
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 25,
  },
  subtitleStyle: {
    fontSize: 13,
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 25,
  },
  left: () => (
    <View style={{ flexDirection: "row" }}>
      <ProfileAvatar
        img_src={props.avatar_img_src}
        size={60}
        is_direct_chat={props.is_direct_chat}
      />
      <View style={{ left: -5 }}>
        <Badge
          visible={props.has_new_message}
          size={12}
          style={{ backgroundColor: props.theme_colors?.notification }}
        />
      </View>
    </View>
  ),
  right: () => (
    <Text style={{ color: props.theme_colors?.text ?? default_theme.TEXT }}>
      {props.last_message_time}
    </Text>
  ),
}))`
  height: 85px;
  padding-right: 16px;
  width: 99%;
  background-color: ${(props) =>
    props.theme_colors?.card ?? default_theme.CARD};
  border-color: ${(props) => props.theme_colors?.card ?? default_theme.CARD};
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  margin-top: 2px;
`;
