import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/Types";
import { default_theme } from "@/constants/Colors";

export const ProfileAvatarIcon: React.FC<UserAvatarProps> = styled(
  Avatar.Icon
).attrs<UserAvatarProps>((props) => ({
  icon: props.icon,
  size: props.icon_size,
  color: props.theme_colors?.text ?? default_theme.TEXT,
}))`
  border-style: solid;
  border-radius: 10px;
  border-width: 2px;
  background-color: ${(props) => props.icon_background_color};
  border-color: ${(props) => props.theme_colors?.text ?? default_theme.TEXT};
`;
