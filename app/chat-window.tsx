import React, { useState, useLayoutEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { ChatList } from "@/components/ChatList/ChatList.component";
import { ThemeColorsProps } from "@/constants/Types";
import { Feather } from "@expo/vector-icons";

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
  const { id, name } = route.params as { id: string; name: string };

  // Display the name on the header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/friend-settings",
              params: { id: id, name: name },
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
        id={id}
        messageSent={messageSent}
        setMessageSent={setMessageSent}
      />
      <InputBar other_id={id} setMessageSent={setMessageSent} />
    </View>
  );
}
