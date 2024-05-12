import React, { useContext } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { View } from "react-native";
import ChatBox from "@/components/ChatBox/ChatBox.component";
import { useTheme } from "@react-navigation/native";

const DATA = [
  {
    id: "shaoji",
    name: "烧鸡",
    icon: "",
    last_msg: "帮紧你",
    last_msg_time: "4:50pm",
  },
  {
    id: "yejiang",
    name: "叶酱",
    icon: "",
    last_msg: "Get some wine",
    last_msg_time: "1:00am",
  },
  {
    id: "jichang",
    name: "鸡肠",
    icon: "",
    last_msg: "ojbk",
    last_msg_time: "11:00pm",
  },
];

export default function ChatListScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={DATA}
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
            <ChatBox user_name={item.name} user_id={item.id} />
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
