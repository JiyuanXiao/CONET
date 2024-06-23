import React, { useState, useEffect, useContext, useRef } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "expo-router";
import { StackActions } from "@react-navigation/native";
import TextMessageBubble from "@/components/MessageBubble/TextMessageBubble.component";
import SystemMessageBubble from "../MessageBubble/SystemMessageBubble.component";
import ImageMessageBubble from "../MessageBubble/ImageMessageBubble.component";
import VideoMessageBubble from "../MessageBubble/VideoMessageBubble.component";
import VoiceMessageBubble from "../MessageBubble/VoiceMessageBubble.component";
import { MessagesContext } from "@/api/messages/messages.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { MessagesProps } from "@/constants/ContextTypes";
import {
  CE_ChatProps,
  CE_ChatMemberProps,
} from "@/constants/ChatEngineObjectTypes";
import { ChatsContext } from "@/api/chats/chats.context";

export const ChatList = (props: {
  chat_id: number;
  messageSent: boolean;
  setMessageSent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loaded_messages, setLoadedMessages] = useState<MessagesProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { messages, resetLoadedMessagesById, loadMessagesById } =
    useContext(MessagesContext);
  const resetLoadedMessagesByIdRef = useRef(resetLoadedMessagesById);
  const { user } = useContext(AuthenticationContext);
  const { chats } = useContext(ChatsContext);
  const [current_chat, setCurrentChat] = useState<CE_ChatProps>();
  const [chat_members, setChatMembers] = useState<
    Map<string, CE_ChatMemberProps>
  >(new Map<string, CE_ChatMemberProps>());
  const navigation = useNavigation();

  const flatListRef = useRef<FlatList>(null);

  const addNewChatMemberToMap = (
    member_username: string,
    member: CE_ChatMemberProps
  ) => {
    setChatMembers(
      new Map<string, CE_ChatMemberProps>(
        chat_members.set(member_username, member)
      )
    );
  };

  useEffect(() => {
    console.log(
      "ChatList(): calling getLoadedMessagesObjectById() for " + props.chat_id
    );

    const current_messages_object = messages.get(Number(props.chat_id));
    const current_loaded_messages =
      current_messages_object?.loaded_messages || [];
    setLoadedMessages(current_loaded_messages);

    // let the function recapture the current props and state of the context
    resetLoadedMessagesByIdRef.current = resetLoadedMessagesById;
  }, [messages]);

  // Scroll to the bottom of the message if user sent a new message
  useEffect(() => {
    if (props.messageSent && loaded_messages.length > 0) {
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
      resetLoadedMessagesByIdRef.current(Number(props.chat_id));
    };
  }, []);

  useEffect(() => {
    const target_chat = chats.get(Number(props.chat_id));
    if (target_chat) {
      setCurrentChat(target_chat);
      for (const member of target_chat.people) {
        addNewChatMemberToMap(member.person.username, member);
      }
    } else {
      console.warn(
        "at useEffect() in ChatList.component.tsx: chat " +
          props.chat_id.toString() +
          " is not in chat context"
      );
      navigation.dispatch(StackActions.popToTop());
    }
  }, [chats]);

  return (
    <FlatList
      inverted
      ref={flatListRef}
      data={loaded_messages}
      renderItem={({ item }: { item: MessagesProps }) => {
        switch (item.content_type) {
          case "text":
            return (
              <TextMessageBubble
                chat_id={Number(props.chat_id)}
                chat_member={chat_members.get(item.sender_username)}
                message_object={item}
                is_direct_chat={
                  current_chat ? Number(current_chat.people.length) <= 2 : false
                }
              />
            );
          case "voice_uri":
            return (
              <VoiceMessageBubble
                chat_id={Number(props.chat_id)}
                chat_member={chat_members.get(item.sender_username)}
                message_object={item}
                is_direct_chat={
                  current_chat ? Number(current_chat.people.length) <= 2 : false
                }
              />
            );
          case "video_uri":
            return (
              <VideoMessageBubble
                chat_id={Number(props.chat_id)}
                chat_member={chat_members.get(item.sender_username)}
                message_object={item}
                is_direct_chat={
                  current_chat ? Number(current_chat.people.length) <= 2 : false
                }
              />
            );
          case "image_uri":
            return (
              <ImageMessageBubble
                chat_id={Number(props.chat_id)}
                chat_member={chat_members.get(item.sender_username)}
                message_object={item}
                is_direct_chat={
                  current_chat ? Number(current_chat.people.length) <= 2 : false
                }
              />
            );
          case "system":
            return (
              <SystemMessageBubble
                chat_id={Number(props.chat_id)}
                chat_member={chat_members.get(item.sender_username)}
                message_object={item}
              />
            );
          default:
            return <></>;
        }
      }}
      keyExtractor={(item) => item.timestamp}
      onEndReached={() => {
        console.log(
          "ChatList(): calling loadMessagesById() for " + props.chat_id
        );
        loadMessagesById(Number(props.chat_id));
      }}
      onEndReachedThreshold={0.05}
    />
  );
};
