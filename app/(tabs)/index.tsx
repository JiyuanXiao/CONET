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
    is_chats_initialized,
    fetchChatDataFromServer,
  } = useContext(ChatsContext);
  const {
    is_messages_initialized,
    messages,
    initializeMessageContext,
    resetMessageContext,
  } = useContext(MessagesContext);
  const { user } = useContext(AuthenticationContext);
  const { resetWebSocket } = useContext(WebSocketContext);
  const [refreshing, setRefreshing] = useState(false);
  //const fetchChatDataFromServerRef = useRef(fetchChatDataFromServer);
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
        target_messages.loaded_messages[0].content_type === "text"
          ? target_messages.loaded_messages[0].text_content
          : "[媒体文件]",
      last_message_time: target_messages.loaded_messages[0].timestamp,
    };
    return result;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    if (user) {
      console.log("refreshing...");
      await fetchChatDataFromServer(user);
      //resetMessageContext();
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
      {is_chats_initialized ? (
        <>
          {is_messages_initialized ? null : (
            <ActivityIndicator
              animating={true}
              color={colors.primary}
              style={{ paddingVertical: 20 }}
            />
          )}
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
