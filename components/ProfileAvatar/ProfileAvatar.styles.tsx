import styled from "styled-components";
import { Avatar } from "react-native-paper";
import { ThemeColorsProps } from "@/constants/Types";

interface AvatorProps {
  icon: string;
  icon_size: number;
  icon_color: string;
  icon_background_color: string;
  icon_border_color: string;
  theme_colors?: ThemeColorsProps;
}

export const ProfileAvatarIcon: React.FC<AvatorProps> = styled(
  Avatar.Icon
).attrs<AvatorProps>((props) => ({
  icon: props.icon,
  size: props.icon_size,
  color: props.icon_color,
}))`
  border-style: "solid";
  border-width: 2px;
  background-color: ${(props) => props.icon_background_color};
  border-color: ${(props) => props.icon_border_color};
`;
