import React from "react";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

import MessageBubble from "@/components/MessageBubble/MessageBubble.component";

export default function ChatWindowScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  let message_1 =
    "When developing with react-native, you need to manually adjust your app to look great on a variety of different screen sizes. That's a tedious job. react-native-size-matters provides some simple tooling to make your scaling a whole lot easier.";
  let message_2 = "Good idea ";
  return (
    <View>
      <MessageBubble message_content={message_1} />
      <MessageBubble message_content={message_2} isReceived />
    </View>
  );
}
