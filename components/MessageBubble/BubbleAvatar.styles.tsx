import styled from "styled-components/native";
import { View } from "react-native";

interface BubbleAvatarContainerProps {
  children: React.ReactNode;
}

export const BubbleAvatarContainer: React.FC<BubbleAvatarContainerProps> = styled(
  View
)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-horizontal: 5px;
  background-color: rgba(0, 0, 0, 0);
`;
