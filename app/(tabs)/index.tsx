import React, { useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "react-native";
import ChatBox from "@/components/ChatBox/ChatBox.component";
import { useTheme } from "@react-navigation/native";
import { ChatsContext } from "@/api/chats/chats.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
//import { FriendProps } from "@/constants/Types";

export default function ChatListScreen() {
  const { colors } = useTheme();
  const { chats } = useContext(ChatsContext);
  const { user } = useContext(AuthenticationContext);
  const { messages_object_list } = useContext(MessagesContext);

  const [current_chats, setCurrentChats] = useState<CE_ChatProps[]>([]);

  useEffect(() => {
    setCurrentChats(chats);
  }, [chats]);

  const getChatTitle = (chat: CE_ChatProps) => {
    if (chat.is_direct_chat) {
      const name_1 = chat.people[0].person.first_name;
      const name_2 = chat.people[1].person.first_name;
      return name_1 === user?.username ? name_2 : name_1;
    } else {
      return chat.title;
    }
  };

  const getChatAvatar = (chat: CE_ChatProps) => {
    if (chat.is_direct_chat) {
      const name_1 = chat.people[0].person.username;
      const avatar_1 = chat.people[0].person.avatar;
      const avatar_2 = chat.people[1].person.avatar;
      return name_1 === user?.username ? avatar_2 : avatar_1;
    } else {
      return "@/assets/avatars/group_chat_avatar.png";
    }
  };

  const getLastMessageInfo = (
    chat_id: number
  ): { last_message: string; last_message_time: string } => {
    if (messages_object_list.length === 0) {
      console.log(
        "at getLastMessageInfo() in index.tsx: Message context is empty"
      );
      return {
        last_message: "",
        last_message_time: "",
      };
    }

    const target_messages_object = messages_object_list.find(
      (messages_object) =>
        messages_object.chat_id.toString() === chat_id.toString()
    );

    if (
      target_messages_object &&
      target_messages_object.loaded_messages.length > 0
    ) {
      const target_message = target_messages_object?.loaded_messages[0];
      const result = {
        last_message:
          target_message.content_type === "text"
            ? target_message.text_content
            : "[媒体文件]",
        last_message_time: target_message.timestamp,
      };
      return result;
    } else if (!target_messages_object) {
      console.log(
        "at getLastMessageInfo() in index.tsx: chat " +
          chat_id +
          " is not in message context yet"
      );
    } else {
      console.log(
        "at getLastMessageInfo() in index.tsx: chat " +
          chat_id +
          "'s loaded message is empty"
      );
    }
    return {
      last_message: "",
      last_message_time: "",
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={current_chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chat-window",
                params: {
                  chat_id: item.id,
                  name: getChatTitle(item),
                  avatar_img_src: getChatAvatar(item),
                },
              });
            }}
            style={styles.chatBoxContainer}
          >
            <ChatBox
              chat_id={item.id}
              chat_title={getChatTitle(item)}
              last_message={getLastMessageInfo(item.id).last_message}
              last_message_time={getLastMessageInfo(item.id).last_message_time}
              is_direct_chat={item.is_direct_chat}
              avatar_img_src={getChatAvatar(item)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chatBoxContainer: {
    alignSelf: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
