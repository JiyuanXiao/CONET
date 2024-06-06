import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/ComponentTypes";
import { Image } from "expo-image";

export const ProfileAvatarIcon: React.FC<UserAvatarProps> = (props) => {
  const [source, setSource] = useState(props.img_src);

  const handleError = () => {
    setSource(require("@/assets/avatars/avatar_default.png"));
  };

  return (
    <Image
      {...props}
      source={source}
      contentFit="contain"
      style={{
        backgroundColor: "transparent",
        width: props.size,
        height: props.size,
        borderRadius: 5,
      }}
      onError={handleError}
    />
  );
};
