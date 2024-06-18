import React from "react";
import styled, { useTheme } from "styled-components/native";
import { Platform } from "react-native";
import {
  ThemeColorsProps,
  TextInputBarProps,
} from "@/constants/ComponentTypes";
import { moderateScale } from "react-native-size-matters";

export const InputBarContainer: React.FC<TextInputBarProps> = styled.KeyboardAvoidingView.attrs(
  {
    behavior: "padding",
    keyboardVerticalOffset: 90,
  }
)`
  justify-content: flex-end;
  align-items: center;
  height: 0px;
  padding-vertical: ${(props) => Math.min(props.inputHeight, 100) + 50}px;
`;

export const InputBox: React.FC<TextInputBarProps> = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-height: 150px;
  background-color: ${(props) => props.theme_colors.background};
  height: ${(props) => Math.min(props.inputHeight, 100) + 50}px;
`;

export const TextInput: React.FC<TextInputBarProps> = styled.TextInput.attrs(
  (props) => ({
    multiline: true,
    returnKeyType: "send",
    blurOnSubmit: false,
    ...props,
  })
)`
  width: 68%;
  height: ${(props) => props.inputHeight + 20}px;
  max-height: 120px;
  padding-left: 5px;
  padding-top: ${Platform.OS === "ios" ? 10 : 0}px;
  background-color: ${(props) => props.theme_colors.border};
  border-radius: 10px;
  font-size: 16px;
  color: ${(props) => props.theme_colors?.text};
`;

export const OffsetFooter: React.FC<{
  theme_colors: ThemeColorsProps;
}> = styled.View`
  background-color: ${(props) => props.theme_colors.background};
  height: ${Platform.OS === "ios" ? moderateScale(20, 3) : 0}px;
`;
