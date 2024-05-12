import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { View } from "react-native";
import { FlatList } from "react-native";
import MessageBubble from "@/components/MessageBubble/MessageBubble.component";
import InputBar from "@/components/InputBar/InputBar.component";
import { useTheme, useRoute, useNavigation } from "@react-navigation/native";
import { fetchAllMessages } from "@/api/messages/messages.storage";
import { useSQLiteContext } from "expo-sqlite";
import { MessagesProps } from "@/constants/Types";
import { AuthenticationContext } from "@/api/authentication/authentication.context";

export default function ChatWindowScreen() {
  const { colors } = useTheme();

  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params as { id: string; name: string };

  const db = useSQLiteContext();
  const { user } = useContext(AuthenticationContext);

  // Get message from local storage and used to set messages state
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      let current_messages = await fetchAllMessages(id, db);
      setMessages(current_messages);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err);
      console.error("fetchMessage() in chat-window.tsx: " + err);
    }
  };

  // Initial render
  useEffect(() => {
    if (!messages || messages.length === 0) {
      fetchMessages();
    }
  }, []);

  // Display the name on the header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            message_content={item.content}
            isReceived={item.receiver_id === user?.id}
          />
        )}
      />
      <InputBar other_id={id} messages={messages} setMessages={setMessages} />
    </View>
  );
}
