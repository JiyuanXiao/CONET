import React from "react";
import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import {
  MessageBubbleProps,
  ThemeColorsProps,
} from "@/constants/ComponentTypes";

export const BubbleContent: React.FC<MessageBubbleProps> = styled.Text.attrs<MessageBubbleProps>(
  (props) => ({
    selectable: true,
    selectionColor: props.theme_colors?.card,
  })
)`
  font-size: 16px;
  justify-content: center;
  color: ${(props) => (props.isReceived ? props.theme_colors?.text : "black")};
`;

export const BubbleConatiner: React.FC<MessageBubbleProps> = styled.View`
  position: relative;
  margin-vertical: ${moderateScale(7, 2)}px;
  justify-content: flex-end;
  flex-direction: ${(props) => (props.isReceived ? "row-reverse" : "row")};
  background-color: rgba(0, 0, 0, 0);
`;

export const Bubble: React.FC<MessageBubbleProps> = styled.View`
  position: relative;
  padding-horizontal: ${moderateScale(12, 2)}px;
  padding-top: ${moderateScale(10, 2)}px;
  padding-bottom: ${moderateScale(10, 2)}px;
  margin-horizontal: ${moderateScale(5, 2)}px;
  max-width: ${moderateScale(250, 1)}px;
  border-radius: 25px;
  border-bottom-left-radius: ${(props) => (props.isReceived ? "0" : "25")}px;
  border-bottom-right-radius: ${(props) => (props.isReceived ? "25" : "0")}px;
  border-color: ${(props) =>
    props.isReceived ? props.theme_colors?.card : props.theme_colors?.primary};
  border-style: solid;
  border-width: 1px;
  background-color: ${(props) =>
    props.isReceived ? props.theme_colors?.card : props.theme_colors?.primary};
`;

export const BubbleTime: React.FC<{
  theme_colors: ThemeColorsProps;
  isReceived: boolean;
  children: React.ReactNode;
}> = styled.Text`
  color: ${(props) => props.theme_colors.border};
  font-size: 10px;
  align-self: ${(props) => (props.isReceived ? "flex-start" : "flex-end")};
  padding-right: ${(props) => (props.isReceived ? "0px" : "8px")};
  padding-left: ${(props) => (props.isReceived ? "8px" : "0px")};
`;

export const BubbleAlias: React.FC<{
  theme_colors: ThemeColorsProps;
  isReceived: boolean;
  children: React.ReactNode;
}> = styled.Text`
  color: ${(props) => props.theme_colors.text};
  font-size: 12px;
  align-self: ${(props) => (props.isReceived ? "flex-end" : "flex-right")};
  padding-right: ${(props) => (props.isReceived ? "10px" : "0px")};
  padding-left: ${(props) => (props.isReceived ? "0px" : "10px")};
`;
