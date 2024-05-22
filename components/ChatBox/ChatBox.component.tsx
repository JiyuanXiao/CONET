import React, { useContext, useEffect, useState } from "react";
import { ChatBoxCard } from "./ChatBox.styles";
import { useTheme } from "@react-navigation/native";
import { ChatBoxProps } from "@/constants/Types";
import { FriendsContext } from "@/api/friends/friends.context";
import { FriendProps } from "@/constants/Types";

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const elapsed_time = now - timestamp * 1000; // Convert to milliseconds

  if (elapsed_time < 24 * 60 * 60 * 1000) {
    // Less than 24 hours
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (elapsed_time < 365 * 24 * 60 * 60 * 1000) {
    // Less than one year
    return new Date(timestamp * 1000).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // More than a year
    return new Date(timestamp * 1000).toLocaleString([], {
      year: "numeric",
      month: "short",
    });
  }
};

const ChatBox = (props: ChatBoxProps) => {
  const { colors } = useTheme();
  const { friends, current_talking_friend_id, getFriendById } =
    useContext(FriendsContext);
  const [friend, setFriend] = useState<FriendProps | undefined>();

  useEffect(() => {
    console.log("ChatBox(): calling getFriendById() for " + props.user_name);
    const curr_friend = getFriendById(props.user_id);
    setFriend(curr_friend);
  }, []);

  // Get the chat's last message and timestamp whenever the chats context is modified
  useEffect(() => {
    if (current_talking_friend_id === props.user_id) {
      console.log("ChatBox(): calling getFriendById() for " + props.user_name);
      const curr_friend = getFriendById(props.user_id);
      setFriend(curr_friend);
    }
  }, [friends]);

  const lastMessageTime = formatTimestamp(
    Number(friend?.last_message_timestamp)
  );

  return (
    <ChatBoxCard
      user_id={props.user_id}
      user_name={props.user_name}
      last_message={friend?.last_message_content}
      last_message_time={lastMessageTime}
      avatar_icon={props.avatar_icon}
      icon_background_color={props.icon_background_color}
      theme_colors={colors}
    />
  );
};

export default ChatBox;
