import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";
import { Image } from "react-native";

export const ProfileAvatarIcon: React.FC<UserAvatarProps> = styled(
  Avatar.Image
).attrs<UserAvatarProps>((props) => ({
  source: props.is_direct_chat
    ? { uri: props.img_src }
    : require("@/assets/avatars/group_chat_avatar.png"),
  //{ uri: props.img_src },
  //source: require(props.img_src),

  size: props.size,
}))``;
