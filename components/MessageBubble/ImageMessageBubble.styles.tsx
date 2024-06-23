import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { Image } from "expo-image";
import { moderateScale } from "react-native-size-matters";
import {
  MessageBubbleProps,
  ThemeColorsProps,
} from "@/constants/ComponentTypes";

interface BubbleImageContentProps {
  source: string;
}

export const BubbleImageContent: React.FC<BubbleImageContentProps> = (
  props
) => {
  const [dimensions, setDimensions] = useState({ width: 140, height: 140 });

  const onLoad = (event: any) => {
    const { width, height } = event.source;

    if (width > height) {
      const aspectRatio = width / height;
      setDimensions({ width: 140, height: 140 / aspectRatio });
    } else {
      const aspectRatio = height / width;
      setDimensions({ width: 140 / aspectRatio, height: 140 });
    }
  };

  return (
    <ImageContainer
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <StyledImage source={props.source} contentFit="contain" onLoad={onLoad} />
    </ImageContainer>
  );
};

const ImageContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
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
  margin-horizontal: ${moderateScale(5, 2)}px;
  margin-vertical: ${moderateScale(5, 2)}px;
  max-width: ${moderateScale(250, 1)}px;

  background-color: ${(props) => props.theme_colors?.background};
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
  max-width: 50px;
  max-height: 20px;
`;
