import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { ChatList } from "@/components/ChatList/ChatList.component";
import { ThemeColorsProps } from "@/constants/Types";
import { Feather } from "@expo/vector-icons";
import { ChatsContext } from "@/api/chats/chats.context";

const MoreIcon = (props: { theme_colors: ThemeColorsProps }) => {
  return (
    <Feather name="more-horizontal" size={26} color={props.theme_colors.text} />
  );
};

export default function ChatWindowScreen() {
  const { colors } = useTheme();

  const [messageSent, setMessageSent] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { chat_id, name, avatar_img_src } = route.params as {
    chat_id: number;
    name: string;
    avatar_img_src: string;
  };

  const { setCurrentTalkingChatId } = useContext(ChatsContext);

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

  useEffect(() => {
    setCurrentTalkingChatId(chat_id);
  }, []);

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
