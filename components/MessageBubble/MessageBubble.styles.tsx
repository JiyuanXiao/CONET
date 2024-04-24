import React from "react";
import styled from "styled-components/native";
import { Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MessageBubbleProps } from "@/constants/Types";

export const BubbleContent: React.FC<MessageBubbleProps> = styled(Text)`
  font-size: 16px;
  justify-content: center;
  color: ${(props) => props.theme_colors?.text};
`;

export const BubbleConatiner: React.FC<MessageBubbleProps> = styled(View)`
  position: relative;
  margin-vertical: ${moderateScale(7, 2)}px;
  justify-content: flex-end;
  flex-direction: ${(props) => (props.isReceived ? "row-reverse" : "row")};
  background-color: rgba(0, 0, 0, 0);
`;

export const Bubble: React.FC<MessageBubbleProps> = styled(View)`
  position: relative;
  padding-horizontal: ${moderateScale(12, 2)}px;
  padding-top: ${moderateScale(10, 2)}px;
  padding-bottom: ${moderateScale(10, 2)}px;
  margin-horizontal: ${moderateScale(5, 2)}px;
  max-width: ${moderateScale(250, 1)}px;
  border-radius: 35px;
  border-bottom-left-radius: ${(props) => (props.isReceived ? "0" : "35")}px;
  border-bottom-right-radius: ${(props) => (props.isReceived ? "35" : "0")}px;
  border-color: ${(props) =>
    props.isReceived ? props.theme_colors?.card : props.theme_colors?.primary};
  border-style: solid;
  border-width: 1px;
  background-color: ${(props) =>
    props.isReceived ? props.theme_colors?.card : props.theme_colors?.primary};
`;
