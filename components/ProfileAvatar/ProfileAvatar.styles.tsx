import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/ComponentTypes";
import { Image } from "expo-image";

export const ProfileAvatarImage: React.FC<UserAvatarProps> = (props) => {
  const [source, setSource] = useState(props.img_src);

  const handleError = () => {
    setSource(require("@/assets/avatars/avatar_default.png"));
  };

  useEffect(() => {
    if (props.img_src.length === 0) {
      setSource(require("@/assets/avatars/avatar_default.png"));
    } else {
      setSource(props.img_src);
    }
  }, [props.img_src]);

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
