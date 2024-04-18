import styled from "styled-components";
import { Card } from "react-native-paper";

interface ChatBoxCardProps {
  user_name: string;
  last_message: string;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  avatar: () => React.JSX.Element;
  last_message_time: () => React.JSX.Element;
}

export const ChatBoxCard: React.FC<ChatBoxCardProps> = styled(
  Card.Title
).attrs<ChatBoxCardProps>((props) => ({
  title: props.user_name,
  subtitle: props.last_message,
  titleStyle: {
    fontSize: 17,
    fontWeight: "bold",
    color: props.colors.text,
    paddingLeft: 10,
  },
  subtitleStyle: {
    fontSize: 13,
    color: props.colors.text,
    paddingLeft: 10,
  },
  left: props.avatar,
  right: props.last_message_time,
}))`
  height: 80px;
  padding-right: 16px;
  width: 98%;
  background-color: ${(props) => props.colors.background};
  border-color: ${(props) => props.colors.text};
  border-style: solid;
  border-width: 2px;
  border-radius: 20px;
  margin-top: 13px;
`;
