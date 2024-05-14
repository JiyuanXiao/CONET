import React, { useState, useLayoutEffect } from "react";
import { View } from "react-native";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { ChatList } from "@/components/ChatList/ChatList.component";

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
