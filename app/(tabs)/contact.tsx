import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Avatar, Divider } from "react-native-paper";
import ContactBar from "@/components/ContactBar/ContactBar.component";
import ContactActionBar from "@/components/ContactBar/ContactActionBar.component";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface ContactProps {
  id: number;
  username: string;
  alias: string;
  avatar: string;
}

const MOCK_CONTACTS = [
  { id: 383299, username: "admin", alias: "龟龟", avatar: "" },
  { id: 383302, username: "jichang", alias: "鸡肠", avatar: "" },
  { id: 383301, username: "shaoji", alias: "烧鸡", avatar: "" },
  { id: 384817, username: "yejiang", alias: "叶酱", avatar: "" },
];

// const MOCK_CONTACTS: ContactProps[] = [];

export default function SettngScreen() {
  const { colors } = useTheme();
  return (
    <>
      <View style={{ marginBottom: 25 }}>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/add-contact",
            });
          }}
        >
          <ContactActionBar
            content="添加联系人"
            IconComponent={() => (
              <Avatar.Icon
                size={50}
                icon={() => (
                  <Feather name="user-plus" size={25} color={colors.text} />
                )}
                style={{
                  borderColor: colors.text,
                  borderWidth: 2,
                  borderRadius: 10,
                  backgroundColor: colors.notification,
                  marginLeft: 10,
                }}
              />
            )}
            theme_colors={colors}
          />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/create-group-chat",
            });
          }}
        >
          <ContactActionBar
            content="群聊"
            IconComponent={() => (
              <Avatar.Icon
                size={50}
                icon={() => (
                  <Ionicons
                    name="chatbubbles-outline"
                    size={26}
                    color={colors.text}
                  />
                )}
                style={{
                  borderColor: colors.text,
                  borderWidth: 2,
                  borderRadius: 10,
                  backgroundColor: "green",
                  marginLeft: 10,
                }}
              />
            )}
            theme_colors={colors}
          />
        </TouchableOpacity>
      </View>
      {MOCK_CONTACTS.length > 0 ? (
        <FlatList
          data={MOCK_CONTACTS}
          renderItem={({ item }: { item: ContactProps }) => (
            <TouchableOpacity onPress={() => {}}>
              <ContactBar
                contact_alias={item.alias}
                avatar_img_src={[item.alias]}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        ></FlatList>
      ) : (
        <Text style={[styles.notice_text, { color: colors.border }]}>
          无联系人
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  notice_text: {
    alignSelf: "center",
    fontSize: 20,
    margin: 10,
  },
});
