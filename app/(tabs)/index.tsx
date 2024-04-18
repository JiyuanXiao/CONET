import React from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Text, View } from "@/components/Themed";
import ChatBox from "@/components/ChatBox/ChatBox.component";

const DATA = [
  {
    id: "0",
    name: "烧鸡",
    icon: "",
    last_msg: "帮紧你",
    last_msg_time: "4:50pm",
  },
  {
    id: "1",
    name: "叶酱",
    icon: "",
    last_msg: "Get some wine",
    last_msg_time: "1:00am",
  },
  {
    id: "2",
    name: "鸡肠",
    icon: "",
    last_msg: "ojbk",
    last_msg_time: "11:00pm",
  },
];

export default function ChatListScreen() {
  return (
    <View style={styles.container}>
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
            <ChatBox
              name={item.name}
              last_msg={item.last_msg}
              last_msg_time={item.last_msg_time}
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
