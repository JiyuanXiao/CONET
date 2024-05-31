import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";
import { Image } from "react-native";

export const ProfileAvatarIcon: React.FC<UserAvatarProps> = (props) => {
  const [source, setSource] = useState(
    props.is_direct_chat
      ? { uri: props.img_src }
      : require("@/assets/avatars/group_chat_avatar.png")
  );

  const handleError = () => {
    setSource(require("@/assets/avatars/avatar_default.png"));
  };

  return (
    <Avatar.Image
      {...props}
      source={source}
      size={props.size}
      onError={handleError}
    />
  );
};
