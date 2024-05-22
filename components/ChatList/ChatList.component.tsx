import React, { useState, useEffect, useContext, useRef } from "react";
import { FlatList } from "react-native";
import MessageBubble from "@/components/MessageBubble/MessageBubble.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { MessagesProps } from "@/constants/Types";
import { FriendsContext } from "@/api/friends/friends.context";

export const ChatList = (props: {
  id: string;
  messageSent: boolean;
  avatar_icon: string;
  icon_background_color: string;
  setMessageSent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    messages_object_list,
    getLoadedMessagesObjectById,
    resetLoadedMessagesById,
    loadMessagesById,
  } = useContext(MessagesContext);
  const resetLoadedMessagesByIdRef = useRef(resetLoadedMessagesById);
  const { user } = useContext(AuthenticationContext);
  const { updateFriendById } = useContext(FriendsContext);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log(
      "ChatList(): calling getLoadedMessagesObjectById() for " + props.id
    );
    const current_messages_object = getLoadedMessagesObjectById(props.id);
    const current_messages = current_messages_object?.loaded_messages || [];
    setMessages(current_messages);

    // let the function recapture the current props and state of the context
    resetLoadedMessagesByIdRef.current = resetLoadedMessagesById;
  }, [messages_object_list]);

  // Scroll to the bottom of the message if user sent a new message
  useEffect(() => {
    if (props.messageSent && messages.length > 0) {
      flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      props.setMessageSent(false);
    }
  }, [props.messageSent]);

  useEffect(() => {
    // This function will be called when the component unmounts
    return () => {
      console.log(
        "ChatList(): calling resetLoadedMessagesById() for " + props.id
      );
      resetLoadedMessagesByIdRef.current(props.id);

      // console.log("ChatList(): calling updateFriendById for " + props.id);
      // updateFriendById(props.id);
    };
  }, []);

  return (
    <FlatList
      inverted
      ref={flatListRef}
      data={messages}
      renderItem={({ item }) => (
        <MessageBubble
          message_content={item.content}
          isReceived={item.receiver_id === user?.account_id}
          avatar_icon={props.avatar_icon}
          icon_background_color={props.icon_background_color}
          timestamp={item.timestamp}
        />
      )}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        console.log("ChatList(): calling loadMessagesById() for " + props.id);
        loadMessagesById(props.id);
      }}
      onEndReachedThreshold={0.05}
    />
  );
};
