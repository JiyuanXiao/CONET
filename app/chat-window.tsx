import React from "react";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

export default function ChatWindowScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
}
