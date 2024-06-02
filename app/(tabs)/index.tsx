import React, { useContext } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View, Text } from "react-native";
import ChatBox from "@/components/ChatBox/ChatBox.component";
import { useTheme } from "@react-navigation/native";
import { ChatsContext } from "@/api/chats/chats.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import { ActivityIndicator } from "react-native-paper";
import * as ChatStorage from "@/api/chats/chats.storage";

export default function ChatListScreen() {
  const { colors } = useTheme();
  const {
    chats,
    has_new_message,
    is_chats_loaded_from_storage,
    is_chats_loading_from_server,
  } = useContext(ChatsContext);
  const { user } = useContext(AuthenticationContext);

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
    const target_chat = chats.get(chat_id);

    if (target_chat) {
      const result = {
        last_message: target_chat.last_message.text
          ? target_chat.last_message.text
          : "[媒体文件]",
        last_message_time: target_chat.last_message.created,
      };
      return result;
    } else {
      console.log(
        "at getLastMessageInfo() in index.tsx: chat " +
          chat_id +
          " is not in chat context"
      );
    }
    return {
      last_message: "",
      last_message_time: "",
    };
  };

  // useEffect(() => {
  //   const initializeLastReadMap = async () => {
  //     console.log("initializeLastReadMap");
  //     for (const chat of chats) {
  //       const last_read_message_id = await ChatStorage.getLastRead(
  //         user?.username,
  //         chat.id
  //       );
  //       const map = last_read_map;
  //       map.set(chat.id, last_read_message_id);

  //       setLastReadMap(map);
  //     }
  //   };

  //   if (is_messages_initialized) {
  //     initializeLastReadMap();

  //     setIsLoading(false);
  //   }
  // });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {is_chats_loaded_from_storage ? (
        <>
          {is_chats_loading_from_server ? (
            <ActivityIndicator
              animating={true}
              color={colors.primary}
              style={{ paddingVertical: 20 }}
            />
          ) : null}
          <FlatList
            data={Array.from(chats.values())}
            renderItem={({ item }) => {
              return (
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
                    last_message_time={
                      getLastMessageInfo(item.id).last_message_time
                    }
                    is_direct_chat={item.is_direct_chat}
                    has_new_message={has_new_message.get(item.id) || false}
                    avatar_img_src={getChatAvatar(item)}
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      ) : (
        <ActivityIndicator
          animating={true}
          size={"large"}
          color={colors.primary}
        />
      )}
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
