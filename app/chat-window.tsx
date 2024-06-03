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
    setHasNewMessageStatus,
    current_talking_chat_id,
    setLastRead,
  } = useContext(ChatsContext);
  const { user } = useContext(AuthenticationContext);

  const navigation = useNavigation();
  const route = useRoute();
  const { chat_id, name, avatar_img_src } = route.params as {
    chat_id: number;
    name: string;
    avatar_img_src: string;
  };

  const updateLastReadMessage = async (chat: CE_ChatProps | undefined) => {
    if (chat) {
      await setLastRead(chat_id, chat.last_message.id);
      console.log(
        `Chat ${chat.id} last read message update to latest message: ${chat.last_message.id}`
      );
    } else {
      console.error(
        "at updateLastReadMessage() in chat-window.tsx: chat not find chat with chat_id: " +
          chat_id
      );
    }
  };

  useEffect(() => {
    setCurrentTalkingChatId(Number(chat_id));

    updateLastReadMessage(chats.get(Number(chat_id)));

    return () => {
      setCurrentTalkingChatId(-1);
    };
  }, []);

  useEffect(() => {
    if (chat_id.toString() === current_talking_chat_id.toString()) {
      updateLastReadMessage(chats.get(Number(chat_id)));
    }
  }, [chats]);

  // Display the name on the header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
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
  }, [navigation, name]);

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
