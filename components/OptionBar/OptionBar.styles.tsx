import React from "react";
import { FlexAlignType } from "react-native";
import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { OptionBarProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";

export const OptionBarCard: React.FC<OptionBarProps> = styled(
  Card.Title
).attrs<OptionBarProps>((props) => ({
  title: props.content,
  titleStyle: {
    fontSize: 17,
    color: props.theme_colors?.text ?? default_theme.TEXT,
    paddingTop: 3,
    alignSelf: (props.align_self as FlexAlignType) ?? "auto",
  },
}))`
  height: 60px;
  width: 100%;
  background-color: ${(props) =>
    props.theme_colors?.card ?? default_theme.CARD};
  border-color: ${(props) => props.theme_colors?.card ?? default_theme.CARD};
  border-style: solid;
  border-width: 2px;
  border-radius: 0px;
  margin-bottom: 10px;
`;
