import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import ProfileAvatar from "@/components/ProfileAvatar/ProfileAvatar.component";
import { ChatBoxProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";
import { ProfileBarProps } from "@/constants/Types";

export const ProfileBarCard: React.FC<ProfileBarProps> = styled(
  Card.Title
).attrs<ProfileBarProps>((props) => ({
  title: props.contact_alias,
  subtitle: props.contact_id
    ? `ID: ${props.contact_id} `
    : `用户名: ${props.contact_username}`,
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
      img_src={props.avatar_img_src}
      size={65}
      is_direct_chat={true}
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
