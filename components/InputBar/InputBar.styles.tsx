import styled from "styled-components/native";
import { Text, View } from "../Themed";
import { KeyboardAvoidingView, Platform } from "react-native";
import React from "react";

interface TextInputContainerProps {
  inputHeight: number;
  children?: React.ReactNode;
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
  background-color: black;
  padding-vertical: ${(props) => Math.min(props.inputHeight, 100) + 50}px;
`;

export const InputBox: React.FC<TextInputContainerProps> = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-height: 150px;
  height: ${(props) => Math.min(props.inputHeight, 100) + 50}px;
`;

interface TextInputProps {
  inputHeight: number;
  value: string | undefined;
  onChangeText: (text: string) => void;
  onContentSizeChange: (event: any) => void;
  theme_colors:
    | {
        primary: string;
        background: string;
        card: string;
        text: string;
        border: string;
        notification: string;
      }
    | undefined;
}

export const TextInput: React.FC<TextInputProps> = styled.TextInput.attrs(
  (props) => ({
    // value: props.value,
    // onChangeText: props.onChangeText,
    // onContentSizeChange: props.onContentSizeChange,
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
  background-color: #1f1f1f;
  border-radius: 10px;
  font-size: 16px;
  color: ${(props) => props.theme_colors?.text};
`;

export const OffsetFooter = styled(View)`
  height: 30px;
`;
