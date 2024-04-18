import styled from "styled-components";
import { Avatar } from "react-native-paper";

interface AvatorProps {
  icon: string;
  icon_size: number;
  icon_color: string;
  theme_colors?:
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

export const ProfileAvatarIcon: React.FC<AvatorProps> = styled(
  Avatar.Icon
).attrs<AvatorProps>((props) => ({
  icon: props.icon,
  size: props.icon_size,
  color: props.icon_color,
}))`
  border-color: ${(props) => props.theme_colors?.text};
  border-style: "solid";
  border-width: 2px;
  background-color: ${(props) => props.theme_colors?.background};
`;
