import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "react-native";
import ChatBox from "@/components/ChatBox/ChatBox.component";
import { useTheme } from "@react-navigation/native";
import { FriendsContext } from "@/api/friends/friends.context";
import { MessagesContext } from "@/api/messages/messages.context";
import { FriendProps } from "@/constants/Types";

export default function ChatListScreen() {
  const { colors } = useTheme();
  const { friends } = useContext(FriendsContext);
  const { messages_object_list } = useContext(MessagesContext);
  const [current_friends, setCurrentFriends] = useState<FriendProps[]>([]);

  useEffect(() => {
    setCurrentFriends(friends);
  }, [friends, messages_object_list]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={current_friends}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chat-window",
                params: {
                  id: item.id,
                  name: item.name,
                  avatar_icon: item.avatar_icon,
                  icon_background_color: item.icon_background_color,
                },
              });
            }}
            style={styles.chatBoxContainer}
          >
            <ChatBox
              user_name={item.name}
              user_id={item.id}
              avatar_icon={item.avatar_icon}
              icon_background_color={item.icon_background_color}
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
