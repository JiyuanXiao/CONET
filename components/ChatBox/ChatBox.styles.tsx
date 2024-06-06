import React from "react";
import styled from "styled-components/native";
import { Card, Badge } from "react-native-paper";
import { Text, View } from "react-native";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import GroupAvatar from "@/components/ProfileAvatar/GroupAvatar.component";
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
    paddingLeft: 15,
  },
  subtitleStyle: {
    fontSize: 13,
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingLeft: 15,
  },
  left: () => (
    <View style={{ flexDirection: "row" }}>
      {props.avatar_img_src.length > 2 ? (
        <GroupAvatar avatars={props.avatar_img_src} size={55} />
      ) : (
        <ProfileAvatar img_src={props.avatar_img_src} size={55} />
      )}
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
