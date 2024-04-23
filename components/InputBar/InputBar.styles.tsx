import React from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { ThemeColorsProps } from "@/constants/Types";

interface TextInputContainerProps {
  inputHeight: number;
  theme_colors: ThemeColorsProps;
  children?: React.ReactNode;
}

interface TextInputProps {
  inputHeight: number;
  value: string | undefined;
  onChangeText: (text: string) => void;
  onContentSizeChange: (event: any) => void;
  theme_colors: ThemeColorsProps;
}

export const InputBarContainer: React.FC<TextInputContainerProps> = styled(
  KeyboardAvoidingView
).attrs({
  behavior: Platform.OS === "ios" ? "padding" : "height",
  keyboardVerticalOffset: Platform.OS === "ios" ? 90 : 0,
})`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding-vertical: ${(props) => Math.min(props.inputHeight, 100) + 50}px;
`;

export const InputBox: React.FC<TextInputContainerProps> = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-height: 150px;
  background-color: ${(props) => props.theme_colors.background};
  height: ${(props) => Math.min(props.inputHeight, 100) + 50}px;
`;

export const TextInput: React.FC<TextInputProps> = styled.TextInput.attrs(
  (props) => ({
    multiline: true,
    returnKeyType: "send",
    blurOnSubmit: false,
    ...props,
  })
)`
  width: 250px;
  height: ${(props) => props.inputHeight + 20}px;
  max-height: 120px;
  padding-left: 5px;
  padding-top: 10px;
  background-color: ${(props) => props.theme_colors.border};
  border-radius: 10px;
  font-size: 16px;
  color: ${(props) => props.theme_colors?.text};
`;

export const OffsetFooter: React.FC<{
  theme_colors: ThemeColorsProps;
}> = styled(View)`
  background-color: ${(props) => props.theme_colors.background};
  height: 30px;
`;
