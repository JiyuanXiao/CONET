import React from "react";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

const ChatPage = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
};

export default ChatPage;
