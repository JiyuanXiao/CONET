import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { View, Text } from "react-native";
import ChatBox from "@/components/ChatBox/ChatBox.component";
import { useTheme } from "@react-navigation/native";
import { ChatsContext } from "@/api/chats/chats.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import { ActivityIndicator } from "react-native-paper";
import { WebSocketContext } from "@/api/websocket/websocket.context";

export default function ChatListScreen() {
  const { colors } = useTheme();
  const {
    chats,
    has_new_message,
    is_chats_loaded_from_local,
    fetchChatDataFromServer,
  } = useContext(ChatsContext);
  const { is_message_loaded_from_local, messages, initializeMessageContext } =
    useContext(MessagesContext);
  const { user } = useContext(AuthenticationContext);
  const { resetWebSocket } = useContext(WebSocketContext);
  const [refreshing, setRefreshing] = useState(false);
  const initializeMessageContextRef = useRef(initializeMessageContext);

  const getChatTitle = (chat: CE_ChatProps) => {
    switch (chat.people.length) {
      case 0:
        return "";
      case 1:
        return chat.people[0].person.first_name;
      case 2:
        const name_1 = chat.people[0].person.first_name;
        const name_2 = chat.people[1].person.first_name;
        return chat.people[0].person.username === user?.username
          ? name_2
          : name_1;
      default:
        return chat.title;
    }
  };

  const getChatAvatar = (chat: CE_ChatProps) => {
    switch (chat.people.length) {
      case 0:
        return ["@/assets/avatars/avatar_default.png"];
      case 1:
        return [chat.people[0].person.avatar];
      case 2:
        const name_1 = chat.people[0].person.username;
        const avatar_1 = chat.people[0].person.avatar;
        const avatar_2 = chat.people[1].person.avatar;
        return name_1 === user?.username ? [avatar_2] : [avatar_1];
      default:
        let count = 0;
        const avatar_list = [];
        for (const member of chat.people) {
          if (count < 9) {
            avatar_list.push(member.person.avatar);
            count += 1;
          } else {
            break;
          }
        }

        return avatar_list;
    }
  };

  const getLastMessageInfo = (
    chat_id: number
  ): { last_message: string; last_message_time: string } => {
    const target_messages = messages.get(Number(chat_id));
    if (!target_messages || target_messages?.loaded_messages.length === 0) {
      return {
        last_message: "",
        last_message_time: "",
      };
    }

    const result = {
      last_message:
        target_messages.loaded_messages[0].content_type === "image_base64" ||
        target_messages.loaded_messages[0].content_type === "image_uri"
          ? "[图片]"
          : target_messages.loaded_messages[0].text_content,
      last_message_time: target_messages.loaded_messages[0].timestamp,
    };
    return result;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    if (user) {
      console.log("refreshing...");
      await fetchChatDataFromServer(user);
      await initializeMessageContextRef.current();
      resetWebSocket();
    }

    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (user) {
      initializeMessageContextRef.current = initializeMessageContext;
    }
  }, [chats, user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {is_message_loaded_from_local ? (
        <FlatList
          data={Array.from(chats.values()).sort((a, b) => {
            const aLastMessageTime = new Date(
              getLastMessageInfo(a.id).last_message_time
            );
            const bLastMessageTime = new Date(
              getLastMessageInfo(b.id).last_message_time
            );
            return bLastMessageTime.getTime() - aLastMessageTime.getTime();
          })}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/chat-window",
                    params: {
                      chat_id: item.id,
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
                  has_new_message={has_new_message.get(item.id) || false}
                  avatar_img_src={getChatAvatar(item)}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
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
