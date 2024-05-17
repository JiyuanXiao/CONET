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
                params: {
                  id: item.id,
                  name: item.name,
                  avatar_icon: item.avatar_icon,
                  icon_color: item.icon_color,
                  icon_background_color: item.icon_background_color,
                  icon_border_color: item.icon_border_color,
                },
              });
            }}
            style={styles.chatBoxContainer}
          >
            <ChatBox
              user_name={item.name}
              user_id={item.id}
              avatar_icon={item.avatar_icon}
              icon_color={item.icon_color}
              icon_background_color={item.icon_background_color}
              icon_border_color={item.icon_border_color}
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
