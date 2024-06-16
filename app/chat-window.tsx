import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { ChatList } from "@/components/ChatList/ChatList.component";
import { ThemeColorsProps } from "@/constants/ComponentTypes";
import { Feather } from "@expo/vector-icons";
import { ChatsContext } from "@/api/chats/chats.context";
import { AuthenticationContext } from "@/api/authentication/authentication.context";
import { CE_ChatProps } from "@/constants/ChatEngineObjectTypes";
import { MessagesContext } from "@/api/messages/messages.context";

const MoreIcon = (props: { theme_colors: ThemeColorsProps }) => {
  return (
    <Feather name="more-horizontal" size={26} color={props.theme_colors.text} />
  );
};

export default function ChatWindowScreen() {
  const { colors } = useTheme();

  const [messageSent, setMessageSent] = useState<boolean>(false);
  const {
    chats,
    setCurrentTalkingChatId,
    current_talking_chat_id,
    setLastRead,
  } = useContext(ChatsContext);
  const { messages } = useContext(MessagesContext);

  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useContext(AuthenticationContext);
  const { chat_id } = route.params as {
    chat_id: number;
  };

  const updateLastReadMessage = async () => {
    const current_chat_messages = messages.get(Number(chat_id));
    if (
      current_chat_messages &&
      current_chat_messages.loaded_messages.length > 0
    ) {
      const latest_message_id =
        current_chat_messages.loaded_messages[0].message_id;
      await setLastRead(chat_id, Number(latest_message_id));
      console.log(
        `Chat ${chat_id} last read message update to latest message: ${latest_message_id}`
      );
    }
  };

  const getChatTitle = (chat: CE_ChatProps | undefined) => {
    if (chat) {
      switch (chat.people.length) {
        case 0:
          return "";
        case 1:
          return chat.people[0].person.first_name.substring(0, 10);
        case 2:
          const name_1 = chat.people[0].person.first_name.substring(0, 10);
          const name_2 = chat.people[1].person.first_name.substring(0, 10);
          return chat.people[0].person.username === user?.username
            ? name_2
            : name_1;
        default:
          return chat.title.substring(0, 10);
      }
    }
    return "";
  };

  useEffect(() => {
    setCurrentTalkingChatId(Number(chat_id));

    return () => {
      setCurrentTalkingChatId(-1);
    };
  }, []);

  useEffect(() => {
    if (current_talking_chat_id === Number(chat_id)) {
      console.log("CHAT WINDOW: update latest read message for " + chat_id);
      updateLastReadMessage();
    }
  }, [messages, current_talking_chat_id]);

  // Display the name on the header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: getChatTitle(chats.get(Number(chat_id))),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/chat-settings",
              params: {
                chat_id: chat_id,
              },
            });
          }}
        >
          <MoreIcon theme_colors={colors} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, chats]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ChatList
        chat_id={chat_id}
        messageSent={messageSent}
        setMessageSent={setMessageSent}
      />
      <InputBar chat_id={chat_id} setMessageSent={setMessageSent} />
    </View>
  );
}
