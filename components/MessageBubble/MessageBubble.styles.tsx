import styled from "styled-components/native";
import { Text, View } from "../Themed";
import { moderateScale } from "react-native-size-matters";
import React from "react";

export const BubbleContent = styled(Text)`
  font-size: 16px;
  justify-content: center;
`;

interface BubbleProps {
  isReceived?: boolean;
  theme_colors?:
    | {
        primary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
      }
    | undefined;
  children?: React.ReactNode;
}

export const BubbleConatiner: React.FC<BubbleProps> = styled(View)`
  position: relative;
  margin-vertical: ${moderateScale(7, 2)}px;
  justify-content: flex-end;
  flex-direction: ${(props) => (props.isReceived ? "row-reverse" : "row")};
`;

export const Bubble: React.FC<BubbleProps> = styled(View)`
  position: relative;
  padding-horizontal: ${moderateScale(12, 2)}px;
  padding-top: ${moderateScale(10, 2)}px;
  padding-bottom: ${moderateScale(10, 2)}px;
  margin-horizontal: ${moderateScale(5, 2)}px;
  max-width: ${moderateScale(250, 1)}px;
  border-radius: 35px;
  border-bottom-left-radius: ${(props) => (props.isReceived ? "0" : "35")}px;
  border-bottom-right-radius: ${(props) => (props.isReceived ? "35" : "0")}px;
  border-color: ${(props) => props.theme_colors?.text};
  border-style: solid;
  border-width: 1px;
  background-color: ${(props) => props.theme_colors?.background};
`;
