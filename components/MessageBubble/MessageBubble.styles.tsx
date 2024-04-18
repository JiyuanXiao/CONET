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
  padding-horizontal: ${moderateScale(10, 2)}px;
  padding-top: ${moderateScale(7, 2)}px;
  padding-bottom: ${moderateScale(7, 2)}px;
  max-width: ${moderateScale(250, 1)}px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.isReceived
      ? props.theme_colors?.border
      : props.theme_colors?.primary};
`;

export const ArrowContainer: React.FC<BubbleProps> = styled(View)`
  position: relative;
  width: ${moderateScale(10, 2)}px;
  bottom: 0;
  backgroud-color: ${(props) => props.theme_colors?.background};
`;

export const Arrow: React.FC<BubbleProps> = styled(View)`
  position: absolute;
  bottom: 0px;
  width: ${moderateScale(10, 2)}px;
  height: ${moderateScale(15, 2)}px;
  align-self: flex-end;
  border-bottom-right-radius: ${(props) => (props.isReceived ? "20" : "0")}px;
  right: ${(props) => (props.isReceived ? moderateScale(-8) + "px" : "auto")};
  border-bottom-left-radius: ${(props) => (props.isReceived ? "0" : "20")}px;
  left: ${(props) => (props.isReceived ? "auto" : moderateScale(-8) + "px")};
  background-color: ${(props) =>
    props.isReceived
      ? props.theme_colors?.border
      : props.theme_colors?.primary};
`;

export const ArrowCover: React.FC<BubbleProps> = styled(View)`
  position: absolute;
  bottom: 0px;
  width: ${moderateScale(10, 2)}px;
  height: ${moderateScale(15, 2)}px;
  align-self: flex-end;
  border-bottom-right-radius: ${(props) => (props.isReceived ? "40" : "0")}px;
  border-bottom-left-radius: ${(props) => (props.isReceived ? "0" : "40")}px;
  background-color: ${(props) => props.theme_colors?.background};
`;
