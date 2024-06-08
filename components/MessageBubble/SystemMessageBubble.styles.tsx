import React from "react";
import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import {
  MessageBubbleProps,
  ThemeColorsProps,
} from "@/constants/ComponentTypes";

export const BubbleContent: React.FC<MessageBubbleProps> = styled.Text.attrs<MessageBubbleProps>(
  (props) => ({})
)`
  font-size: 12px;

  justify-content: center;
  color: ${(props) => props.theme_colors?.primary};
`;

export const BubbleConatiner: React.FC<MessageBubbleProps> = styled.View`
  position: relative;
  margin-vertical: ${moderateScale(7, 2)}px;
  justify-content: center;
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0);
`;

export const Bubble: React.FC<MessageBubbleProps> = styled.View`
  position: relative;
  padding-horizontal: 12px;
  padding-vertical: 8px;
  margin-horizontal: ${moderateScale(5, 2)}px;
  max-width: ${moderateScale(250, 1)}px;
  border-radius: 25px;

  border-color: ${(props) => props.theme_colors?.primary};
  border-style: solid;
  border-width: 2px;
  background-color: #b76700;
`;
