import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { UserAvatarProps } from "@/constants/Types";

export const ProfileAvatarIcon: React.FC<UserAvatarProps> = styled(
  Avatar.Icon
).attrs<UserAvatarProps>((props) => ({
  icon: props.icon,
  size: props.icon_size,
  color: props.icon_color,
}))`
  border-style: "solid";
  border-width: 2px;
  background-color: ${(props) => props.icon_background_color};
  border-color: ${(props) => props.icon_border_color};
`;
