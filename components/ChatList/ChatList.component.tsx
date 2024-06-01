import React, { useState, useEffect, useContext, useRef } from "react";
import { FlatList } from "react-native";
import MessageBubble from "@/components/MessageBubble/MessageBubble.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { MessagesProps } from "@/constants/ContextTypes";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import { ChatsContext } from "@/api/chats/chats.context";

export const ChatList = (props: {
  chat_id: number;
  messageSent: boolean;
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
  const { chats } = useContext(ChatsContext);
  const [current_chat, setCurrentChat] = useState<CE_ChatProps>();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log(
      "ChatList(): calling getLoadedMessagesObjectById() for " + props.chat_id
    );

    const current_messages_object = getLoadedMessagesObjectById(props.chat_id);
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
        "ChatList(): calling resetLoadedMessagesById() for " + props.chat_id
      );
      resetLoadedMessagesByIdRef.current(props.chat_id);
    };
  }, []);

  useEffect(() => {
    const current_chat = chats.find(
      (chat) => chat.id.toString() === props.chat_id.toString()
    );
    if (current_chat) {
      setCurrentChat(current_chat);
    } else {
      console.error(
        "at ChatWindowScreen() in chat-window.tsx: chat " +
          props.chat_id.toString() +
          " is not in chat context"
      );
    }
  }, [chats]);

  return (
    <FlatList
      inverted
      ref={flatListRef}
      data={messages}
      renderItem={({ item }: { item: MessagesProps }) => (
        <MessageBubble
          chat_member={current_chat?.people.find(
            (chat_member) =>
              chat_member.person.username === item.sender_username
          )}
          chat_id={props.chat_id}
          message_object={item}
          is_direct_chat={current_chat?.is_direct_chat || false}
        />
      )}
      keyExtractor={(item) => item.message_id.toString()}
      onEndReached={() => {
        console.log(
          "ChatList(): calling loadMessagesById() for " + props.chat_id
        );
        loadMessagesById(props.chat_id);
      }}
      onEndReachedThreshold={0.05}
    />
  );
};
