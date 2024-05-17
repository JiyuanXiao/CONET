import React, { useContext } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "react-native";
import ChatBox from "@/components/ChatBox/ChatBox.component";
import { useTheme } from "@react-navigation/native";
import { ChatsContext } from "@/api/chats/chats.context";

export default function ChatListScreen() {
  const { colors } = useTheme();
  const { chats } = useContext(ChatsContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chat-window",
                params: { id: item.id, name: item.name },
              });
            }}
            style={styles.chatBoxContainer}
          >
            <ChatBox
              user_name={item.name}
              user_id={item.id}
              avatar_icon="alien"
              icon_color={colors.text}
              icon_background_color={colors.border}
              icon_border_color={colors.text}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
